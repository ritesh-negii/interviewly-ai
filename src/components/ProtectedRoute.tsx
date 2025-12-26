// src/components/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
  requireResume?: boolean;
}

export function ProtectedRoute({
  children,
  requireProfile = false,
  requireResume = false,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Authenticated but profile not complete
      if (requireProfile && user && !user.profileCompleted) {
        router.push("/profile");
        return;
      }

      // Authenticated but resume not uploaded
      if (requireResume && user && !user.resumeUploaded) {
        router.push("/resume");
        return;
      }
    }
  }, [loading, isAuthenticated, user, requireProfile, requireResume, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Profile required but not complete
  if (requireProfile && user && !user.profileCompleted) {
    return null; // Will redirect via useEffect
  }

  // Resume required but not uploaded
  if (requireResume && user && !user.resumeUploaded) {
    return null; // Will redirect via useEffect
  }

  // All checks passed - render children
  return <>{children}</>;
}