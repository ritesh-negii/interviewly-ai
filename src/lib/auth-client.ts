// src/lib/auth-client.ts
import { api } from "./api";
import type { AuthResponse, SignupRequest, LoginRequest, User } from "@/types/user";

// Token management
export const authClient = {
  // ✅ Save token to localStorage
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  // ✅ Get token from localStorage
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  // ✅ Remove token (CRITICAL for logout)
  clearToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  },

  // ✅ Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // ✅ Signup
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/signup", data);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  // ✅ Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/api/auth/login", data);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  },

  // ✅ Get current user (must send token in header)
  async getMe(): Promise<{ success: boolean; user: User }> {
    return api.get("/api/auth/me");
  },

  // ✅ Logout (clear token + redirect handled in AuthContext)
  logout() {
    this.clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};