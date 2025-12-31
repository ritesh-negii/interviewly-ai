"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  Brain, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Target,
  Clock,
  Zap,
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function InterviewStartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        
        body: JSON.stringify({ 
          type: "role-specific", 
          duration: "standard" 
        })
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/interview/${data.sessionId}/session`);
      } else {
        alert("Failed to start interview");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-3xl w-full space-y-8">
            
            {/* Back Link */}
            <Link 
              href="/interview"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Choose Different Interview Type
            </Link>

            {/* Header with Enhanced Visual */}
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-2xl">
                  <Brain className="h-12 w-12" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border-2 border-primary/20">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary">AI-Powered Interview</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground">
                  Ready to Begin?
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                  The AI has analyzed your resume and prepared personalized questions tailored to your skills and experience.
                </p>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <FeatureCard 
                icon={<Sparkles className="h-5 w-5" />}
                title="Personalized"
                description="Questions based on your resume"
                gradient="from-blue-500 to-cyan-500"
              />
              <FeatureCard 
                icon={<Zap className="h-5 w-5" />}
                title="Real-time"
                description="Instant AI feedback"
                gradient="from-green-500 to-emerald-500"
              />
              <FeatureCard 
                icon={<Target className="h-5 w-5" />}
                title="Adaptive"
                description="Difficulty adjusts to you"
                gradient="from-purple-500 to-pink-500"
              />
              <FeatureCard 
                icon={<Award className="h-5 w-5" />}
                title="Detailed"
                description="Comprehensive scoring"
                gradient="from-orange-500 to-red-500"
              />
            </div>

            {/* Main Info Card */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">What to Expect</h3>
                    <p className="text-sm text-muted-foreground">
                      This AI-powered interview will adapt to your responses and provide detailed feedback.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">45-60 min</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">10-12</p>
                      <p className="text-xs text-muted-foreground">Questions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Advanced</p>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Quick Tips for Success
              </h3>
              <ul className="space-y-3">
                {[
                  "Find a quiet space with stable internet connection",
                  "Have a notepad ready for quick notes",
                  "Take your time - quality over speed",
                  "Speak clearly and provide detailed answers"
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Start Button Section */}
            <div className="text-center space-y-4 pt-4">
              <button
                onClick={handleStart}
                disabled={loading}
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white text-base sm:text-lg font-bold rounded-2xl hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Generating Your Interview...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-6 w-6" />
                    <span>Begin AI Interview</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4" />
                <span>Your session will be saved automatically</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, gradient }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-5 hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      <div className="relative z-10 space-y-3">
        <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <div>
          <h4 className="font-bold text-sm text-foreground mb-1">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}