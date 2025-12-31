export interface User {
  id: string;
  name: string;
  email: string;
  resumeUploaded?: boolean;
  
  profileCompleted?: boolean; 
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}