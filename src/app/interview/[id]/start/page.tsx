"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Clock,
  Brain,
  Target,
  Loader2,
  ArrowRight,
  Settings,
  ChevronRight,
  FileText,
  Zap,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Sparkles
} from "lucide-react";

export default function InterviewStartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const interviewTypeId = (params?.id as string) || "technical";

  const [starting, setStarting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  
  const getQuestionRange = () => {
    if (interviewTypeId === "ai-powered") return "10-12";
    if (interviewTypeId === "behavioral") return "8-10";
    return "3"; 
  };

  const handleStartInterview = async () => {
    if (!agreedToTerms) return;

    setStarting(true);

    try {
      let apiType = "technical";
      if (interviewTypeId === "ai-powered") apiType = "role-specific";
      if (interviewTypeId === "behavioral") apiType = "behavioral";


      const durationMode = apiType === "technical" ? "quick" : "standard";

      const res: any = await api.post("/api/interview/start", {
        type: apiType,
        difficulty: "medium",
        duration: durationMode 
      });

      if (res.sessionId) {
        router.push(`/interview/${res.sessionId}/session`);
      } else {
        throw new Error("No session ID returned");
      }
    } catch (error) {
      console.error("Failed to start:", error);
      alert("Failed to start interview. Please try again.");
      setStarting(false);
    }
  };

  const getInterviewIcon = () => {
    if (interviewTypeId === "ai-powered") return <Brain className="h-7 w-7" />;
    if (interviewTypeId === "behavioral") return <Target className="h-7 w-7" />;
    return <Zap className="h-7 w-7" />;
  };

  const getInterviewColor = () => {
    if (interviewTypeId === "ai-powered") return "from-green-500 to-emerald-500";
    if (interviewTypeId === "behavioral") return "from-purple-500 to-pink-500";
    return "from-blue-500 to-cyan-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/interview" className="hover:text-primary transition-colors">Interview</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="capitalize text-foreground font-medium">{interviewTypeId.replace("-", " ")}</span>
          </div>
          
          <div className="flex items-start gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getInterviewColor()} shadow-xl flex-shrink-0`}>
              <div className="text-white">{getInterviewIcon()}</div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 capitalize text-foreground">
                {interviewTypeId.replace("-", " ")}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">Ready to begin your practice session?</p>
            </div>
          </div>
        </div>

        {/* Main Details Card */}
        <div className="mb-6 rounded-3xl border-2 border-border bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
          <div className={`p-6 md:p-8 bg-gradient-to-br ${getInterviewColor()} bg-opacity-5`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${getInterviewColor()} shadow-lg flex-shrink-0`}>
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 capitalize text-foreground">
                  {interviewTypeId.replace("-", " ")} Session
                </h2>
                <p className="text-muted-foreground">
                  AI-Powered Text Assessment with Real-time Feedback
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative overflow-hidden p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Duration</span>
                  <p className="text-2xl font-extrabold text-foreground">~15 min</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Questions</span>
                  
                  <p className="text-2xl font-extrabold text-foreground">{getQuestionRange()}</p>
                </div>
              </div>
              
              <div className="relative overflow-hidden p-5 rounded-2xl border-2 border-border bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Level</span>
                  <p className="text-2xl font-extrabold text-foreground">Medium</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/20 rounded-2xl p-5 flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm text-foreground/80 leading-relaxed">
                <strong className="text-foreground">How it works:</strong> This is a text-based interview. You'll type your answers, and our advanced AI will analyze them for technical accuracy, clarity, communication skills, and depth of understanding.
              </div>
            </div>

            {/* What You'll Receive */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                What You'll Receive
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Detailed feedback on each answer",
                  // ✅ Dynamic text update here
                  `${getQuestionRange()} Questions tailored to your role`,
                  "Strengths and improvement areas",
                  "Overall performance summary"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="mb-6 p-6 rounded-2xl border-2 border-border bg-card shadow-lg">
          <label className="flex items-start gap-4 cursor-pointer group select-none">
            <div className="relative flex items-center flex-shrink-0">
              <input 
                type="checkbox" 
                checked={agreedToTerms} 
                onChange={(e) => setAgreedToTerms(e.target.checked)} 
                className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-muted-foreground/30 bg-background transition-all checked:border-primary checked:bg-primary"
              />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-lg mb-1">I'm ready to start</p>
              <p className="text-sm text-muted-foreground">
                My responses will be evaluated by AI to provide personalized feedback.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/interview" 
            className="sm:w-auto px-6 py-4 border-2 border-border rounded-xl font-bold hover:bg-accent transition-all flex items-center justify-center text-center hover:scale-105"
          >
            Cancel
          </Link>
          <button
            onClick={handleStartInterview}
            disabled={!agreedToTerms || starting}
            className="flex-1 group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            {starting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Starting Session...</span>
              </>
            ) : (
              <>
                <Brain className="h-5 w-5" />
                <span>Start Interview</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Your progress will be automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}