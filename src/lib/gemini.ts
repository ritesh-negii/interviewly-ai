// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { IUserProfile } from "@/models/user";
import { IParsedData } from "@/models/Resume";
import { IInterviewSession } from "@/models/InterviewSession";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}


// Analyze Resume with Gemini

export async function analyzeResumeWithGemini(
  resumeText: string,
  retries = 3
): Promise<IParsedData> {
  const prompt = `
You are a strictly technical resume parser.
Return ONLY valid JSON. No markdown.

Required format:
{
  "skills": ["skill1", "skill2"],
  "projects": [
    { "name": "Project Name", "description": "Short description", "technologies": ["tech1"] }
  ],
  "experience": [
    { "role": "Role", "company": "Company", "duration": "Duration", "description": "Description" }
  ],
  "education": [
    { "degree": "Degree", "institution": "Institute name", "year": "Year" }
  ]
}

Resume Text:
${resumeText}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 503 && retries > 0) {
        console.warn(`⚠️ Gemini overloaded. Retrying... (${retries})`);
        await new Promise((res) => setTimeout(res, 2000));
        return analyzeResumeWithGemini(resumeText, retries - 1);
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(
      rawText.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch (error: any) {
    console.error("❌ Gemini Error:", error.message);
    throw new Error("Failed to analyze resume");
  }
}


// Generate Interview Question

interface QuestionContext {
  type: "technical" | "behavioral" | "role-specific";
  difficulty: "easy" | "medium" | "hard";
  profile: IUserProfile;
  resume: IParsedData;
  questionNumber: number;
  previousQuestions: { text: string }[];
}

interface GeneratedQuestion {
  id: string;
  text: string;
  category: "DSA" | "System Design" | "Behavioral" | "Technical" | "General";
  difficulty: "easy" | "medium" | "hard";
}

export async function generateQuestion(
  context: QuestionContext
): Promise<GeneratedQuestion> {
  const { type, difficulty, profile, resume, questionNumber, previousQuestions } = context;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let typeSpecificContext = "";
  if (type === "technical") {
    typeSpecificContext = `Focus: DSA, System Design, OOP, design patterns`;
  } else if (type === "behavioral") {
    typeSpecificContext = `Focus: STAR method, teamwork, leadership`;
  } else {
    typeSpecificContext = `Focus: Technologies from resume: ${resume?.skills?.join(", ") || "General"}`;
  }

  const prompt = `
You are an expert interviewer conducting a ${type} interview.

Candidate: ${profile?.targetRole || "Software Developer"} (${profile?.experience || "Fresher"})
Skills: ${resume?.skills?.join(", ") || "Not specified"}

${typeSpecificContext}
Difficulty: ${difficulty}
Question #${questionNumber}

${previousQuestions?.length ? `Previously asked:\n${previousQuestions.map((q, i) => `${i + 1}. ${q.text}`).join("\n")}` : ""}

Generate ONE unique question. Return ONLY valid JSON:
{
  "text": "Your question?",
  "category": "DSA" | "System Design" | "Behavioral" | "Technical" | "General",
  "difficulty": "easy" | "medium" | "hard"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);

    return {
      id: uuidv4(),
      text: parsed.text,
      category: parsed.category,
      difficulty: parsed.difficulty || difficulty,
    };
  } catch (error) {
    console.error("❌ Question generation error:", error);
    return {
      id: uuidv4(),
      text: "Tell me about your experience with software development.",
      category: "General",
      difficulty,
    };
  }
}


// Evaluate Answer

interface EvaluationContext {
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  onStream?: (chunk: string) => void;
}

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export async function evaluateAnswer(
  context: EvaluationContext
): Promise<Evaluation> {
  const { question, answer, category, difficulty, onStream } = context;

  if (!answer || answer.trim().length < 10) {
    return {
      score: 1,
      feedback: "Answer too brief. Provide more details.",
      strengths: [],
      improvements: ["Elaborate more", "Include examples"],
    };
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
Evaluate this interview answer:

Question: ${question}
Category: ${category}
Difficulty: ${difficulty}
Answer: "${answer}"

Return ONLY valid JSON:
{
  "score": 8,
  "feedback": "2-4 sentences of feedback",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}
`;

  try {
    if (onStream) {
      const result = await model.generateContentStream(prompt);
      let fullText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onStream(chunkText);
      }
      const cleaned = fullText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        score: Math.min(10, Math.max(0, parsed.score || 5)),
        feedback: parsed.feedback || "Answer evaluated.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 3) : [],
      };
    } else {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      return {
        score: Math.min(10, Math.max(0, parsed.score || 5)),
        feedback: parsed.feedback || "Answer evaluated.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 3) : [],
      };
    }
  } catch (error) {
    console.error("❌ Evaluation error:", error);
    return {
      score: 5,
      feedback: "Could not evaluate. Try again.",
      strengths: ["Attempted answer"],
      improvements: ["Provide more detail"],
    };
  }
}


// Generate Final Report

export async function generateFinalReport(session: IInterviewSession) {
  const answeredQuestions = session.questions.filter(
    (q) => q.answer && q.answer !== "[SKIPPED]"
  );

  if (answeredQuestions.length === 0) {
    return {
      strengths: ["Completed interview"],
      weaknesses: ["No answers provided"],
      recommendations: ["Try answering next time"],
    };
  }

  const avgScore =
    answeredQuestions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0) /
    answeredQuestions.length;

  return {
    strengths: avgScore >= 7 ? ["Strong performance"] : ["Completed interview"],
    weaknesses: avgScore < 5 ? ["Needs improvement"] : [],
    recommendations: [
      avgScore < 6 ? "Focus on fundamentals" : "Keep practicing",
      "Review challenging questions",
    ],
  };
}