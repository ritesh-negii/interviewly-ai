// src/lib/constants.ts

// Interview Types
export const INTERVIEW_TYPES = {
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  ROLE_SPECIFIC: "role-specific",
} as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[keyof typeof INTERVIEW_TYPES];

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

// Interview Durations
export const INTERVIEW_DURATIONS = {
  QUICK: "quick",
  STANDARD: "standard",
  FULL: "full",
} as const;

export type InterviewDuration = (typeof INTERVIEW_DURATIONS)[keyof typeof INTERVIEW_DURATIONS];

// Question Counts by Duration
export const QUESTION_COUNTS: Record<InterviewDuration, number> = {
  quick: 5,
  standard: 10,
  full: 15,
};

// Interview Status
export const INTERVIEW_STATUS = {
  IN_PROGRESS: "in-progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
} as const;

export type InterviewStatus = (typeof INTERVIEW_STATUS)[keyof typeof INTERVIEW_STATUS];

// Question Categories
export const QUESTION_CATEGORIES = {
  DSA: "DSA",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
  TECHNICAL: "Technical",
  GENERAL: "General",
} as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[keyof typeof QUESTION_CATEGORIES];

// Resume Status
export const RESUME_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
} as const;

export type ResumeStatus = (typeof RESUME_STATUS)[keyof typeof RESUME_STATUS];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  "Fresher (0-1 years)",
  "Junior (1-3 years)",
  "Mid-level (3-5 years)",
  "Senior (5+ years)",
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

// Education Years
export const EDUCATION_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Graduated",
] as const;

export type EducationYear = (typeof EDUCATION_YEARS)[number];

// Score Ranges
export const SCORE_RANGES = {
  EXCELLENT: { min: 9, max: 10, label: "Excellent" },
  GOOD: { min: 7, max: 8, label: "Good" },
  AVERAGE: { min: 4, max: 6, label: "Average" },
  POOR: { min: 1, max: 3, label: "Poor" },
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    SIGNUP: "Signup successful",
    LOGIN: "Login successful",
    PROFILE_UPDATE: "Profile updated successfully",
    RESUME_UPLOAD: "Resume analyzed successfully",
    INTERVIEW_STARTED: "Interview started successfully",
    ANSWER_SUBMITTED: "Answer submitted successfully",
  },
  ERROR: {
    UNAUTHORIZED: "Unauthorized",
    USER_NOT_FOUND: "User not found",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_EXISTS: "User already exists",
    RESUME_NOT_FOUND: "Resume not found",
    SESSION_NOT_FOUND: "Interview session not found",
    INVALID_SESSION: "Invalid or inactive session",
    SERVER_ERROR: "Server error",
  },
} as const;