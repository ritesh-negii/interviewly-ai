// src/lib/interview.ts
import InterviewSession from "@/models/InterviewSession";
import User from "@/models/UserModel";
import Resume from "@/models/Resume";
import { generateQuestion, evaluateAnswer, generateFinalReport } from "./gemini";

const EMPTY_RESUME = { 
  skills: [], 
  projects: [], 
  experience: [], 
  education: [] 
};


export async function getNextQuestion(userId: string, sessionId: string) {
  const session: any = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session || session.status !== "in-progress") {
    throw new Error("Invalid or inactive session");
  }

  // STOP if we have reached the limit
  if (session.questions.length >= session.totalQuestions) {
     const lastQ = session.questions[session.questions.length - 1];
     if (lastQ.answer) {
         throw new Error("Interview already complete");
     }
  }

  const lastQuestion = session.questions[session.questions.length - 1];
  const isLastQuestionUnanswered = lastQuestion && (!lastQuestion.answer || lastQuestion.answer.trim() === "");

  if (isLastQuestionUnanswered) {
    return {
      question: {
        id: lastQuestion.id,
        text: lastQuestion.text,
        category: lastQuestion.category,
        difficulty: lastQuestion.difficulty,
      },
      questionNumber: session.questions.length,
      totalQuestions: session.totalQuestions,
    };
  }

  const user = await User.findById(userId);
  const resume = await Resume.findOne({ userId });

  const nextQuestionNum = session.questions.length + 1;

  const askedQuestions = session.questions
    .filter((q: any) => q.answer && q.answer.trim().length > 0)
    .map((q: any) => ({ text: q.text }));

  const nextQuestion = await generateQuestion({
    type: session.type,
    difficulty: session.difficulty,
    profile: user?.profile || {},
    resume: resume?.parsedData || EMPTY_RESUME,
    questionNumber: nextQuestionNum,
    previousQuestions: askedQuestions,
  });

  session.questions.push({
    id: nextQuestion.id,
    text: nextQuestion.text,
    category: nextQuestion.category,
    difficulty: nextQuestion.difficulty,
  });

  session.currentQuestionIndex = session.questions.length - 1;
  await session.save();

  return {
    question: {
      id: nextQuestion.id,
      text: nextQuestion.text,
      category: nextQuestion.category,
      difficulty: nextQuestion.difficulty,
    },
    questionNumber: nextQuestionNum,
    totalQuestions: session.totalQuestions,
  };
}

export async function startInterview(
  userId: string,
  type: "technical" | "behavioral" | "role-specific",
  difficulty: "easy" | "medium" | "hard",
  duration: "quick" | "standard" | "full"
) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const resume = await Resume.findOne({ userId });
  if (!resume && type === "role-specific") {
    throw new Error("Resume required for role-specific interviews");
  }

  const safeType = type.toLowerCase();
  
  // ✅ STRICT LOGIC: If duration is "quick", ALWAYS give 3 questions.
  let totalQuestions = 3; 

  if (duration === "quick") {
      totalQuestions = 3;
  } else {
      // Standard Logic for non-quick interviews
      if (safeType === "technical") totalQuestions = 8;
      else if (safeType === "behavioral") totalQuestions = 10;
      else totalQuestions = 12; // role-specific
  }

  const firstQuestion = await generateQuestion({
    type,
    difficulty,
    profile: user.profile,
    resume: resume?.parsedData || EMPTY_RESUME, 
    questionNumber: 1,
    previousQuestions: [],
  });

  const session: any = await InterviewSession.create({
    userId,
    type,
    difficulty,
    duration,
    totalQuestions,
    currentQuestionIndex: 0,
    questions: [
      {
        id: firstQuestion.id,
        text: firstQuestion.text,
        category: firstQuestion.category,
        difficulty: firstQuestion.difficulty,
      },
    ],
    startedAt: new Date(),
    status: "in-progress",
  } as any);

  return {
    sessionId: session._id.toString(),
    question: {
      id: firstQuestion.id,
      text: firstQuestion.text,
      category: firstQuestion.category,
      difficulty: firstQuestion.difficulty,
    },
    questionNumber: 1,
    totalQuestions,
  };
}



export async function submitAnswer(
  userId: string,
  sessionId: string,
  questionId: string,
  answer: string,
  timeSpent: number
) {
  const session: any = await InterviewSession.findOne({ _id: sessionId, userId });

  if (!session || session.status !== "in-progress") {
    throw new Error("Invalid or inactive session");
  }

  const questionIndex = session.questions.findIndex((q: any) => q.id === questionId);
  if (questionIndex === -1) throw new Error("Question not found");

  const evaluation = await evaluateAnswer({
    question: session.questions[questionIndex].text,
    answer: answer.trim(),
    category: session.questions[questionIndex].category,
    difficulty: session.questions[questionIndex].difficulty,
  });

  session.questions[questionIndex].answer = answer.trim();
  session.questions[questionIndex].evaluation = evaluation;
  session.questions[questionIndex].timeSpent = timeSpent;
  session.questions[questionIndex].answeredAt = new Date();
  
  session.totalTimeSpent = session.questions.reduce(
    (sum: number, q: any) => sum + (q.timeSpent || 0), 0
  );

  await session.save();

  const answeredCount = session.questions.filter(
    (q: any) => q.answer && q.answer !== "[SKIPPED]"
  ).length;

  const isComplete = answeredCount >= session.totalQuestions;

  if (isComplete) {
      await completeInterview(userId, sessionId);
  }

  return {
    evaluation,
    isComplete,
    sessionId: session._id.toString(),
  };
}

export async function skipQuestion(userId: string, sessionId: string) {
  const session: any = await InterviewSession.findOne({ _id: sessionId, userId });

  if (!session) throw new Error("Session not found");

  const skipIndex = session.currentQuestionIndex < session.questions.length
      ? session.currentQuestionIndex
      : session.questions.length - 1;

  if (skipIndex < 0 || skipIndex >= session.questions.length) {
    throw new Error("Invalid question index");
  }

  session.questions[skipIndex].answer = "[SKIPPED]";
  session.questions[skipIndex].evaluation = {
    score: 0,
    feedback: "Question was skipped",
    strengths: [],
    improvements: ["Answer the question to get feedback"],
  };

  session.currentQuestionIndex = skipIndex + 1;
  await session.save();

  const isComplete = session.currentQuestionIndex >= session.totalQuestions;

  if (isComplete) {
      await completeInterview(userId, sessionId);
  }

  return { isComplete, sessionId: session._id.toString() };
}

export async function completeInterview(userId: string, sessionId: string) {
  const session: any = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) throw new Error("Session not found");

  const overallScore = typeof session.calculateOverallScore === 'function' 
    ? session.calculateOverallScore() 
    : 0;
    
  const finalReport = await generateFinalReport(session);

  session.status = "completed";
  session.completedAt = new Date();
  session.overallScore = overallScore;
  session.finalReport = {
    ...finalReport,
    categoryScores: typeof session.getCategoryBreakdown === 'function'
      ? session.getCategoryBreakdown()
      : {},
  };

  await session.save();

  return {
    sessionId: session._id.toString(),
    overallScore,
    report: session.finalReport,
    totalQuestions: session.totalQuestions,
  };
}

export async function getSession(userId: string, sessionId: string) {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });
  if (!session) throw new Error("Session not found");
  return session;
}

export async function pauseInterview(userId: string, sessionId: string) {
  const session = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    { status: "paused" },
    { new: true }
  );
  if (!session) throw new Error("Session not found");
  return session;
}

export async function resumeInterview(userId: string, sessionId: string) {
  const session = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    { status: "in-progress" },
    { new: true }
  );
  if (!session) throw new Error("Session not found");
  return session;
}