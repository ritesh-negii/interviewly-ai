// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { User, SignupRequest, LoginRequest } from "@/types/user";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signup: (data: SignupRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      if (!authClient.isAuthenticated()) {
        setLoading(false);
        return;
      }

      const response = await authClient.getMe();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Failed to load user:", error);
      authClient.clearToken();
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function signup(data: SignupRequest) {
    try {
      const response = await authClient.signup(data);
      
      if (response.success && response.user) {
        setUser(response.user as User);
        setIsAuthenticated(true);
        toast.success("Account created successfully!");
        router.push("/profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      throw error;
    }
  }

  async function login(data: LoginRequest) {
    try {
      const response = await authClient.login(data);
      
      if (response.success && response.user) {
        setUser(response.user as User);
        setIsAuthenticated(true);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  }

  function logout() {
    authClient.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}