// src/types/user.ts
import type { ExperienceLevel, EducationYear } from "@/lib/constants";

export interface UserProfile {
  college?: string;
  degree?: string;
  year?: EducationYear; 
  targetRole?: string;
  experience?: ExperienceLevel; 
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileCompleted: boolean;
  resumeUploaded: boolean;
  profile: UserProfile;
  createdAt: string; 
  updatedAt: string; 
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    profileCompleted: boolean;
    profile?: UserProfile;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  college: string;
  degree: string;
  year: EducationYear; 
  targetRole: string;
  experience: ExperienceLevel; 
}