// src/lib/auth-client.ts
import { api } from "./api";
import type { AuthResponse, SignupRequest, LoginRequest, User } from "@/types/user";


export const authClient = {
  
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

 
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  
  clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },


  isAuthenticated(): boolean {
    return !!this.getToken();
  },


  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/signup", data);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/login", data);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },


  async getMe(): Promise<{ success: boolean; user: User }> {
    return api.get("/api/auth/me");
  },

  
  logout() {
    this.clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};