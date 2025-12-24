// src/lib/interview.ts
import InterviewSession, { IInterviewSession } from "@/models/InterviewSession";
import User from "@/models/user";
import Resume from "@/models/Resume";
import { generateQuestion, evaluateAnswer, generateFinalReport } from "./gemini";

// ========================================
// Start New Interview Session
// ========================================
export async function startInterview(
  userId: string,
  type: "technical" | "behavioral" | "role-specific",
  difficulty: "easy" | "medium" | "hard",
  duration: "quick" | "standard" | "full"
) {
  // Validate user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // For role-specific, require resume
  const resume = await Resume.findOne({ userId });
  if (!resume && type === "role-specific") {
    throw new Error("Resume required for role-specific interviews");
  }

  // Determine total questions
  const questionCounts = { quick: 5, standard: 10, full: 15 };
  const totalQuestions = questionCounts[duration] || 10;

  // Generate first question
  const firstQuestion = await generateQuestion({
    type,
    difficulty,
    profile: user.profile,
    resume: resume?.parsedData || {},
    questionNumber: 1,
    previousQuestions: [],
  });

  // Create session
  const session = await InterviewSession.create({
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
  });

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

// ========================================
// Submit Answer to Current Question
// ========================================
export async function submitAnswer(
  userId: string,
  sessionId: string,
  questionId: string,
  answer: string,
  timeSpent: number
) {
  // Find session
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session || session.status !== "in-progress") {
    throw new Error("Invalid or inactive session");
  }

  // Find question
  const questionIndex = session.questions.findIndex((q) => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error("Question not found");
  }

  // Evaluate answer
  const evaluation = await evaluateAnswer({
    question: session.questions[questionIndex].text,
    answer: answer.trim(),
    category: session.questions[questionIndex].category,
    difficulty: session.questions[questionIndex].difficulty,
  });

  // Update session
  session.questions[questionIndex].answer = answer.trim();
  session.questions[questionIndex].evaluation = evaluation;
  session.questions[questionIndex].timeSpent = timeSpent;
  session.questions[questionIndex].answeredAt = new Date();
  session.totalTimeSpent = session.questions.reduce(
    (sum, q) => sum + (q.timeSpent || 0),
    0
  );

  await session.save();

  // ✅ FIX #2: Check completion based on ANSWERED questions, not total questions
  const answeredCount = session.questions.filter(
    (q) => q.answer && q.answer !== "[SKIPPED]"
  ).length;

  const isComplete = answeredCount >= session.totalQuestions;

  return {
    evaluation,
    isComplete,
    sessionId: session._id.toString(),
  };
}

// ========================================
// Get Next Question
// ========================================
export async function getNextQuestion(userId: string, sessionId: string) {
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session || session.status !== "in-progress") {
    throw new Error("Invalid or inactive session");
  }

  // Check if already complete
  if (session.questions.length >= session.totalQuestions) {
    throw new Error("Interview already complete");
  }

  const user = await User.findById(userId);
  const resume = await Resume.findOne({ userId });

  const nextQuestionNum = session.questions.length + 1;

  const askedQuestions = session.questions
    .filter((q) => q.answer && q.answer.trim().length > 0)
    .map((q) => ({ text: q.text }));

  // Generate next question
  const nextQuestion = await generateQuestion({
    type: session.type,
    difficulty: session.difficulty,
    profile: user?.profile || {},
    resume: resume?.parsedData || {},
    questionNumber: nextQuestionNum,
    previousQuestions: askedQuestions,
  });

  // Add to session
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

// ========================================
// Skip Current Question
// ========================================
export async function skipQuestion(userId: string, sessionId: string) {
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new Error("Session not found");
  }

  // ✅ FIX #4: Safe index handling to prevent invalid skips
  const skipIndex =
    session.currentQuestionIndex < session.questions.length
      ? session.currentQuestionIndex
      : session.questions.length - 1;

  if (skipIndex < 0 || skipIndex >= session.questions.length) {
    throw new Error("Invalid question index");
  }

  // Mark as skipped
  session.questions[skipIndex].answer = "[SKIPPED]";
  session.questions[skipIndex].evaluation = {
    score: 0,
    feedback: "Question was skipped",
    strengths: [],
    improvements: ["Answer the question to get feedback"],
  };

  session.currentQuestionIndex = skipIndex + 1;
  await session.save();

  // Check if complete
  const isComplete = session.currentQuestionIndex >= session.totalQuestions;

  return { isComplete, sessionId: session._id.toString() };
}

// ========================================
// Complete Interview and Generate Report
// ========================================
export async function completeInterview(userId: string, sessionId: string) {
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new Error("Session not found");
  }

  // Calculate scores
  const overallScore = session.calculateOverallScore();
  const finalReport = await generateFinalReport(session);

  // Update session
  session.status = "completed";
  session.completedAt = new Date();
  session.overallScore = overallScore;
  session.finalReport = {
    ...finalReport,
    categoryScores: session.getCategoryBreakdown(),
  };

  await session.save();

  return {
    sessionId: session._id.toString(),
    overallScore,
    report: session.finalReport,
    totalQuestions: session.totalQuestions,
  };
}

// ========================================
// Get Session Details
// ========================================
export async function getSession(userId: string, sessionId: string) {
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new Error("Session not found");
  }

  return session;
}

// ========================================
// Pause/Resume Interview
// ========================================
export async function pauseInterview(userId: string, sessionId: string) {
  // ✅ FIX #6: Return session for API feedback
  const session = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    { status: "paused" },
    { new: true }
  );
  
  if (!session) {
    throw new Error("Session not found");
  }
  
  return session;
}

export async function resumeInterview(userId: string, sessionId: string) {
  // ✅ FIX #6: Return session for API feedback
  const session = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    { status: "in-progress" },
    { new: true }
  );
  
  if (!session) {
    throw new Error("Session not found");
  }
  
  return session;
}