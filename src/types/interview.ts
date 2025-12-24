
// src/types/interview.ts

export type InterviewType = "technical" | "behavioral" | "role-specific";
export type DifficultyLevel = "easy" | "medium" | "hard";
export type InterviewDuration = "quick" | "standard" | "full";
export type InterviewStatus = "in-progress" | "paused" | "completed" | "abandoned";
export type QuestionCategory = "DSA" | "System Design" | "Behavioral" | "Technical" | "General";

export interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  answer?: string;
  evaluation?: Evaluation;
  timeSpent?: number;
  answeredAt?: string; 
}

export interface FinalReport {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  categoryScores?: Record<string, number>;
}

export interface InterviewSession {
  id: string;
  userId: string;
  type: InterviewType;
  difficulty: DifficultyLevel;
  duration: InterviewDuration;
  status: InterviewStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: Question[];
  overallScore: number;
  finalReport?: FinalReport;
  startedAt: string;
  
  completedAt?: string; 
  totalTimeSpent: number;
  createdAt: string; 
  updatedAt: string; 
}

// API Request/Response Types
export interface StartInterviewRequest {
  type: InterviewType;
  difficulty: DifficultyLevel;
  duration: InterviewDuration;
}

export interface StartInterviewResponse {
  success: boolean;
  sessionId?: string;
  question?: Question;
  questionNumber?: number;
  totalQuestions?: number;
  message?: string;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
  timeSpent: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  evaluation?: Evaluation;
  isComplete?: boolean;
  message?: string;
}

export interface GetNextQuestionResponse {
  success: boolean;
  question?: Question;
  questionNumber?: number;
  totalQuestions?: number;
  message?: string;
}

export interface CompleteInterviewResponse {
  success: boolean;
  sessionId?: string;
  overallScore?: number;
  report?: FinalReport;
  totalQuestions?: number;
  message?: string;
}