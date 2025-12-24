// src/models/InterviewSession.ts
import mongoose, { Schema, Model } from "mongoose";

export interface IEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface IQuestion {
  id: string; 
  text: string;
  category: "DSA" | "System Design" | "Behavioral" | "Technical" | "General";
  difficulty: "easy" | "medium" | "hard";
  answer?: string;
  evaluation?: IEvaluation;
  timeSpent?: number;
  answeredAt?: Date;
}

export interface IFinalReport {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  categoryScores?: {
    [key: string]: number;
  };
}

// ✅ FIXED: Removed "extends Document"
export interface IInterviewSession {
  _id: string;
  userId: mongoose.Types.ObjectId;
  socketId?: string;
  type: "technical" | "behavioral" | "role-specific";
  difficulty: "easy" | "medium" | "hard";
  duration: "quick" | "standard" | "full";
  status: "in-progress" | "paused" | "completed" | "abandoned";
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: IQuestion[];
  overallScore: number;
  finalReport?: IFinalReport;
  startedAt: Date;
  completedAt?: Date;
  totalTimeSpent: number;
  createdAt: Date;
  updatedAt: Date;
  calculateOverallScore(): number;
  getCategoryBreakdown(): { [key: string]: number };
}

const questionSchema = new Schema<IQuestion>({
  id: { type: String, required: true }, // ✅ FIXED: Changed from questionId to id
  text: { type: String, required: true },
  category: {
    type: String,
    enum: ["DSA", "System Design", "Behavioral", "Technical", "General"],
    default: "General",
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  answer: { type: String, default: "" },
  evaluation: {
    score: { type: Number, min: 0, max: 10, default: 0 },
    feedback: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
  },
  timeSpent: { type: Number, default: 0 },
  answeredAt: Date,
});

const interviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    socketId: String,
    type: {
      type: String,
      enum: ["technical", "behavioral", "role-specific"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    duration: {
      type: String,
      enum: ["quick", "standard", "full"],
      default: "standard",
    },
    status: {
      type: String,
      enum: ["in-progress", "paused", "completed", "abandoned"],
      default: "in-progress",
      index: true,
    },
    currentQuestionIndex: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 10 },
    questions: [questionSchema],
    overallScore: { type: Number, default: 0, min: 0, max: 100 },
    finalReport: {
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
      categoryScores: Schema.Types.Mixed,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    totalTimeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Methods
interviewSessionSchema.methods.calculateOverallScore = function (): number {
  const answeredQuestions = this.questions.filter(
    (q: IQuestion) => q.evaluation && q.evaluation.score > 0
  );

  if (answeredQuestions.length === 0) {
    this.overallScore = 0;
    return 0;
  }

  const totalScore = answeredQuestions.reduce(
    (sum: number, q: IQuestion) => sum + (q.evaluation?.score || 0),
    0
  );
  const avgScore = totalScore / answeredQuestions.length;
  this.overallScore = Math.round(avgScore * 10);
  return this.overallScore;
};

interviewSessionSchema.methods.getCategoryBreakdown = function (): {
  [key: string]: number;
} {
  const categories: { [key: string]: { total: number; count: number } } = {};

  this.questions.forEach((q: IQuestion) => {
    if (!q.evaluation || !q.evaluation.score) return;

    const cat = q.category;
    if (!categories[cat]) {
      categories[cat] = { total: 0, count: 0 };
    }

    categories[cat].total += q.evaluation.score;
    categories[cat].count += 1;
  });

  const breakdown: { [key: string]: number } = {};
  Object.keys(categories).forEach((cat) => {
    breakdown[cat] = Math.round(
      (categories[cat].total / categories[cat].count) * 10
    );
  });

  return breakdown;
};

const InterviewSession: Model<IInterviewSession> =
  mongoose.models.InterviewSession ||
  mongoose.model<IInterviewSession>("InterviewSession", interviewSessionSchema);

export default InterviewSession;