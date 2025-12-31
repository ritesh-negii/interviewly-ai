// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { IUserProfile } from "@/models/User";
import { IParsedData } from "@/models/Resume";
import { IInterviewSession } from "@/models/InterviewSession";

const RAW_KEYS = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
const API_KEYS = RAW_KEYS.split(",").map(k => k.trim()).filter(k => k.length > 0);

if (API_KEYS.length === 0) {
  throw new Error("No GEMINI_API_KEYS found in .env.local");
}


const MODEL_NAME = "gemini-2.5-flash-lite"; 

async function runWithKeyRotation<T>(
  operation: (model: any) => Promise<T>
): Promise<T> {
  let lastError: any;

  for (const apiKey of API_KEYS) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
 
      const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        generationConfig: { responseMimeType: "application/json" } 
      });
      
      return await operation(model);
    } catch (error: any) {
     
      const isQuotaError = 
        error.message?.includes("429") || 
        error.message?.includes("Quota") || 
        error.message?.includes("Too Many Requests") ||
        error.status === 429;
      
      if (isQuotaError) {
        console.warn(`⚠️ Key ending in ...${apiKey.slice(-4)} exhausted. Switching...`);
        lastError = error;
        continue; 
      } else {
        throw error; 
      }
    }
  }

  console.error("❌ CRITICAL: All API keys exhausted.");
  throw lastError;
}

export async function analyzeResumeWithGemini(
  resumeText: string
): Promise<IParsedData> {
  const defaultErrorResponse = { skills: [], projects: [], experience: [], education: [] };

  try {
    return await runWithKeyRotation(async (model) => {
      const prompt = `
        You are a strictly technical resume parser.
        Return ONLY valid JSON.
        
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
        ${resumeText.slice(0, 15000)} 
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text(); 
      return JSON.parse(text);
    });
  } catch (error) {
    console.error("❌ Gemini Resume Analysis Failed:", error);
    return defaultErrorResponse;
  }
}

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
  category: string;
  difficulty: string;
}

export async function generateQuestion(
  context: QuestionContext
): Promise<GeneratedQuestion> {
  const { type, difficulty, profile, resume, questionNumber, previousQuestions } = context;

  console.log(`👀 Generating ${type} question (${difficulty})`);

  try {
    return await runWithKeyRotation(async (model) => {
      
      let specificInstructions = "";

      if (type === "technical") {
        specificInstructions = `
          CONTEXT: This is a pure Technical Interview (DSA & System Design).
          INSTRUCTIONS:
          1. Ask a coding problem (Data Structures & Algorithms) OR a System Design concept.
          2. Difficulty Level: ${difficulty}.
          3. DO NOT ask about the user's specific resume projects. Stick to general CS concepts.
          4. Topics: Arrays, Strings, Trees, Graphs, SQL, Scalability, APIs.
        `;
      } else if (type === "behavioral") {
        specificInstructions = `
          CONTEXT: This is a Behavioral Interview (HR Round).
          INSTRUCTIONS:
          1. Ask a soft-skill question requiring the STAR method.
          2. Focus on: Leadership, Conflict, Adaptability, Teamwork.
        `;
      } else {
        
        specificInstructions = `
          CONTEXT: This is a Personalized Resume-Based Interview.
          INSTRUCTIONS:
          1. Analyze the candidate's Projects and Skills.
          2. Ask a specific technical question about THEIR implementation.
          3. IF RESUME IS EMPTY: Ask a standard full-stack web development question.
          4. DO NOT use placeholders. Use actual data.
        `;
      }

      const prompt = `
        You are an expert interviewer.
        
        CANDIDATE DATA (Use ONLY if this is a Resume-Based interview):
        - Skills: ${JSON.stringify(resume?.skills || [])}
        - Projects: ${JSON.stringify(resume?.projects || [])}
        
        SESSION DETAILS:
        - Question Number: ${questionNumber}
        - Previously Asked (DO NOT REPEAT): ${previousQuestions?.map(q => q.text).join(" | ")}
        
        ${specificInstructions}
        
        Return ONLY valid JSON:
        {
          "text": "The question text",
          "category": "${type === 'behavioral' ? 'Behavioral' : 'Technical'}",
          "difficulty": "${difficulty}"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const parsed = JSON.parse(text);

      return {
        id: uuidv4(),
        text: parsed.text,
        category: parsed.category || "Technical",
        difficulty: parsed.difficulty || difficulty,
      };
    });
  } catch (error) {
    console.error("❌ Question Gen Failed:", error);
    return {
      id: uuidv4(),
      text: "Tell me about the most challenging technical problem you have solved recently.",
      category: "Technical",
      difficulty: "medium",
    };
  }
}

interface EvaluationContext {
  question: string;
  answer: string;
  category: string;
  difficulty: string;
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
  const { question, answer, category, difficulty } = context;

  if (!answer || answer.trim().length < 2) {
    return {
      score: 0,
      feedback: "No answer provided.",
      strengths: [],
      improvements: ["Please provide an answer."],
    };
  }

  try {
    return await runWithKeyRotation(async (model) => {
      const prompt = `
        Evaluate this interview answer.
        Question: "${question}"
        Category: ${category}
        Difficulty: ${difficulty}
        User Answer: "${answer}"
        
        Return ONLY valid JSON:
        {
          "score": (number 0-10),
          "feedback": "2-3 sentences of constructive feedback",
          "strengths": ["point 1", "point 2"],
          "improvements": ["point 1", "point 2"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const parsed = JSON.parse(text);

      return {
        score: parsed.score || 5,
        feedback: parsed.feedback || "Good attempt.",
        strengths: parsed.strengths || [],
        improvements: parsed.improvements || [],
      };
    });
  } catch (error) {
    console.error("❌ Evaluation Failed:", error);
    return {
      score: 5,
      feedback: "Could not process answer due to server load.",
      strengths: [],
      improvements: [],
    };
  }
}

export async function generateFinalReport(session: IInterviewSession) {
  const answeredQuestions = session.questions.filter(
    (q) => q.answer && q.answer !== "[SKIPPED]"
  );

  if (answeredQuestions.length === 0) {
    return {
      summary: "No questions answered.",
      strengths: [],
      weaknesses: ["Participation"],
      recommendations: ["Complete the interview next time"],
    };
  }

  try {
    return await runWithKeyRotation(async (model) => {
      const prompt = `
        Generate a final interview feedback report based on this session:
        
        Candidate Data:
        ${JSON.stringify(answeredQuestions.map(q => ({
          question: q.text,
          answer: q.answer,
          score: q.evaluation?.score
        })))}
        
        Output JSON ONLY:
        {
          "summary": "Overall summary of performance (3-4 sentences)",
          "keyStrengths": ["strength 1", "strength 2", "strength 3"],
          "areasForImprovement": ["area 1", "area 2", "area 3"],
          "recommendation": "Strong Hire / Hire / Weak Hire / No Hire"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const parsed = JSON.parse(text);

      return {
        summary: parsed.summary,
        strengths: parsed.keyStrengths,
        weaknesses: parsed.areasForImprovement,
        recommendations: [parsed.recommendation, ...parsed.areasForImprovement],
      };
    });
  } catch (error) {
    console.error("❌ Final Report Failed:", error);
    return {
      summary: "Interview completed.",
      strengths: ["Completed the session"],
      weaknesses: [],
      recommendations: ["Review your answers manually"]
    };
  }
}