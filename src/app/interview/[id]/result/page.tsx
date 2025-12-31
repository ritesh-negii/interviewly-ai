"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { 
  Loader2, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Calendar,
  Share2,
  Download,
  Home,
  RefreshCw
} from "lucide-react";

export default function InterviewResultPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
      
        const data: any = await api.get(`/api/interview/${id}`);
        
        if (data) {
          setSession(data);
        }
      } catch (error) {
        console.error("Failed to load results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-foreground">Generating your report...</h2>
        <p className="text-slate-500 dark:text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-background p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Results Not Found</h2>
          <p className="text-slate-600 dark:text-muted-foreground">We couldn't find the data for this interview.</p>
          <Link href="/dashboard" className="px-6 py-3 bg-primary text-white rounded-xl font-bold inline-flex items-center gap-2">
            <Home className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const score = session.overallScore || 0;
  
  
  const duration = Math.ceil((session.totalTimeSpent || 0) / 60); 
  
  const questionCount = session.questions?.length || 0;
  const feedback = session.finalReport || {};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-background font-sans pb-10">
        
        {/* Header */}
        <header className="bg-white dark:bg-card border-b border-slate-200 dark:border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/dashboard" className="font-bold text-xl flex items-center gap-2">
              <span className="bg-primary/10 text-primary p-1.5 rounded-lg">
                <Award className="h-5 w-5" />
              </span>
              <span>Interviewly</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Great Job! 🎉</h1>
                  <p className="text-green-100 text-lg">You've completed your {session.type} interview.</p>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{duration} mins</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>{questionCount} Questions</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white text-green-700 rounded-2xl p-6 text-center min-w-[160px] shadow-lg">
                  <p className="text-sm font-bold uppercase tracking-wider opacity-70">Overall Score</p>
                  <div className="text-5xl font-black my-1">{score}%</div>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className={`h-2 w-2 rounded-full ${star <= (score / 20) ? 'bg-green-600' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Feedback Column */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Executive Summary */}
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 dark:text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Summary
                </h3>
                <p className="text-slate-700 dark:text-muted-foreground leading-relaxed text-lg">
                  {feedback.summary || "No summary available for this session."}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-100 dark:border-green-900/30 p-6">
                  <h4 className="font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Key Strengths
                  </h4>
                  <ul className="space-y-3">
                    {feedback.strengths?.length > 0 ? (
                      feedback.strengths.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-900 dark:text-green-100">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-green-800 opacity-60">Keep practicing to build strengths!</li>
                    )}
                  </ul>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 p-6">
                  <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" /> Areas to Improve
                  </h4>
                  <ul className="space-y-3">
                    {feedback.weaknesses?.length > 0 ? (
                      feedback.weaknesses.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-orange-900 dark:text-orange-100">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-orange-800 opacity-60">No specific weaknesses detected.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 p-6">
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">Recommended Next Steps</h3>
                <ul className="space-y-3">
                  {feedback.recommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-blue-800 dark:text-blue-200">
                      <div className="h-6 w-6 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span>{rec}</span>
                    </li>
                  ))}
                  {(!feedback.recommendations || feedback.recommendations.length === 0) && (
                     <li className="text-blue-800">Review your answers and try another practice session.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border p-5 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-foreground mb-4">Actions</h4>
                <div className="space-y-3">
                  <Link href="/interview" className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <RefreshCw className="h-4 w-4" /> Practice Again
                  </Link>
                  <Link href="/dashboard" className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-secondary dark:hover:bg-secondary/80 text-slate-700 dark:text-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    <Home className="h-4 w-4" /> Dashboard
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border p-5 shadow-sm">
                <h4 className="font-bold text-slate-900 dark:text-foreground mb-2">Share Result</h4>
                <p className="text-xs text-slate-500 mb-4">Showcase your progress to your network.</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="flex-1 py-2 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}