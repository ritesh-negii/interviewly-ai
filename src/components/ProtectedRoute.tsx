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
     
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

     
      if (requireProfile && user && !user.profileCompleted) {
        router.push("/profile");
        return;
      }

      if (requireResume && user && !user.resumeUploaded) {
        router.push("/resume");
        return;
      }
    }
  }, [loading, isAuthenticated, user, requireProfile, requireResume, router]);

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

  
  if (!isAuthenticated) {
    return null; 
  }

  
  if (requireProfile && user && !user.profileCompleted) {
    return null; 
  }

 
  if (requireResume && user && !user.resumeUploaded) {
    return null; 
  }

  
  return <>{children}</>;
}