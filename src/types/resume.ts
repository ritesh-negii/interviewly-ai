// src/types/resume.ts

export interface Project {
  name: string;
  description?: string;
  technologies?: string[];
}

export interface Experience {
  role: string;
  company: string;
  duration?: string;
  description?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year?: string;
}

export interface ParsedResumeData {
  skills?: string[];
  projects?: Project[];
  experience?: Experience[];
  education?: Education[];
  targetRole?: string;
  experienceLevel?: string;
}

export interface Resume {
  id: string;
  userId: string;
  originalText: string;
  parsedData: ParsedResumeData;
  status: "pending" | "confirmed";
  createdAt: string;
  updatedAt: string; 
}

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  resumeId?: string;
  data?: ParsedResumeData;
}