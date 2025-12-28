// src/app/interview/[id]/start/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Video,
  Mic,
  Volume2,
  Wifi,
  Camera,
  Settings,
  ChevronRight,
} from "lucide-react";

interface InterviewDetails {
  id: string;
  type: string;
  role: string;
  duration: number;
  totalQuestions: number;
  difficulty: string;
  categories: string[];
  instructions: string[];
}

export default function InterviewStartPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemCheck, setSystemCheck] = useState({
    microphone: false,
    camera: false,
    internet: false,
  });
  const [checkingSystem, setCheckingSystem] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load interview details
    const loadInterview = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setInterview({
          id: params.id as string,
          type: "Technical Interview",
          role: "Frontend Developer",
          duration: 45,
          totalQuestions: 8,
          difficulty: "Intermediate",
          categories: ["JavaScript", "React", "System Design", "Problem Solving"],
          instructions: [
            "Read each question carefully before answering",
            "Take your time to think through your response",
            "Use the STAR method for behavioral questions",
            "Explain your thought process for technical questions",
            "You can skip questions and return to them later",
            "Your interview will auto-submit when time expires",
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to load interview:", error);
        router.push("/interview");
      }
    };

    loadInterview();
  }, [isAuthenticated, router, params.id]);

  useEffect(() => {
    // Simulate system check
    const performSystemCheck = async () => {
      setCheckingSystem(true);

      // Check microphone
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSystemCheck((prev) => ({ ...prev, microphone: true }));

      // Check camera
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSystemCheck((prev) => ({ ...prev, camera: true }));

      // Check internet
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSystemCheck((prev) => ({ ...prev, internet: true }));

      setCheckingSystem(false);
    };

    performSystemCheck();
  }, []);

  const handleStartInterview = () => {
    if (!agreedToTerms) {
      alert("Please agree to the terms before starting");
      return;
    }

    // Navigate to interview session
    router.push(`/interview/${params.id}/session`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading interview details...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Interview Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The interview you're looking for doesn't exist
          </p>
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90"
          >
            Back to Interviews
          </Link>
        </div>
      </div>
    );
  }

  const allSystemsReady = systemCheck.microphone && systemCheck.camera && systemCheck.internet;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/interview" className="hover:text-foreground">Interviews</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Setup</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview Setup</h1>
          <p className="text-muted-foreground">
            Review the details and prepare for your interview
          </p>
        </div>

        {/* Interview Details Card */}
        <div className="mb-6 p-6 md:p-8 rounded-2xl border bg-card">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{interview.type}</h2>
              <p className="text-muted-foreground">Role: {interview.role}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="text-2xl font-bold">{interview.duration} min</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
                <span className="text-sm">Questions</span>
              </div>
              <p className="text-2xl font-bold">{interview.totalQuestions}</p>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50 border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Level</span>
              </div>
              <p className="text-2xl font-bold">{interview.difficulty}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Topics Covered</h3>
            <div className="flex flex-wrap gap-2">
              {interview.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* System Check Card */}
        <div className="mb-6 p-6 rounded-2xl border bg-card">
          <h3 className="font-bold text-lg mb-4">System Check</h3>

          <div className="space-y-3">
            <SystemCheckItem
              icon={<Mic className="h-5 w-5" />}
              label="Microphone"
              status={systemCheck.microphone}
              checking={checkingSystem}
            />
            <SystemCheckItem
              icon={<Camera className="h-5 w-5" />}
              label="Camera"
              status={systemCheck.camera}
              checking={checkingSystem}
            />
            <SystemCheckItem
              icon={<Wifi className="h-5 w-5" />}
              label="Internet Connection"
              status={systemCheck.internet}
              checking={checkingSystem}
            />
          </div>

          {!checkingSystem && !allSystemsReady && (
            <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-600 mb-1">System Check Failed</p>
                <p className="text-muted-foreground">
                  Some features may not work properly. Please check your device settings.
                </p>
              </div>
            </div>
          )}

          {!checkingSystem && allSystemsReady && (
            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm font-medium text-green-600">
                All systems ready!
              </p>
            </div>
          )}
        </div>

        {/* Instructions Card */}
        <div className="mb-6 p-6 rounded-2xl border bg-card">
          <h3 className="font-bold text-lg mb-4">Important Instructions</h3>

          <ul className="space-y-3">
            {interview.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <p className="text-muted-foreground pt-0.5">{instruction}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Terms Agreement */}
        <div className="mb-6 p-6 rounded-2xl border bg-card">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-2 border-primary text-primary focus:ring-2 focus:ring-primary cursor-pointer"
            />
            <div className="flex-1">
              <p className="font-medium group-hover:text-primary transition-colors">
                I understand the interview guidelines
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                I agree to follow the instructions and complete the interview honestly.
                My responses will be evaluated by AI and used to provide feedback.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/interview"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-semibold hover:bg-accent transition-colors"
          >
            Cancel
          </Link>

          <button
            onClick={handleStartInterview}
            disabled={!agreedToTerms || checkingSystem}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            {checkingSystem ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Checking System...
              </>
            ) : (
              <>
                Start Interview
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SystemCheckItem({
  icon,
  label,
  status,
  checking,
}: {
  icon: React.ReactNode;
  label: string;
  status: boolean;
  checking: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      {checking ? (
        <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
      ) : status ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}