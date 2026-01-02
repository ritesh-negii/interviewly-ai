"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { api } from "@/lib/api";
import { Calendar, CheckCircle, Clock, ArrowRight, Loader2, AlertTriangle, History } from "lucide-react";

export default function HistoryPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data: any = await api.get("/api/history");
        if (Array.isArray(data)) {
          setInterviews(data);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    // FIX 1: Use 'bg-background' instead of hardcoded slate colors
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <History className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
                Interview History
            </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your past sessions...</p>
          </div>
        ) : interviews.length === 0 ? (
          // FIX 2: Use 'bg-card' and 'border-border' for the empty state
          <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
            <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No interviews yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You haven't completed any mock interviews yet. Start one now to build your history!
            </p>
            <Link 
              href="/interview" 
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-2"
            >
              Start Interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {interviews.map((interview: any) => (
              <div 
                key={interview._id} 
                // FIX 3: Fully responsive card styling with dark mode support
                className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    interview.status === 'completed' 
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {interview.status === 'completed' ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="font-bold text-lg text-foreground capitalize group-hover:text-primary transition-colors">
                      {interview.type.replace('-', ' ')} Interview
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(interview.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span className={`capitalize px-2 py-0.5 rounded text-xs font-medium border ${
                          interview.difficulty === 'High' || interview.difficulty === 'Advanced' 
                          ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                          : interview.difficulty === 'Medium' || interview.difficulty === 'Intermediate'
                          ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                          : 'bg-green-500/10 text-green-600 border-green-500/20'
                      }`}>
                        {interview.difficulty}
                      </span>
                      
                      {interview.status !== 'completed' && (
                          <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-bold ml-1">
                            <AlertTriangle className="h-3 w-3" /> In Progress
                          </span>
                       )}
                    </div>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-border">
                  {interview.status === 'completed' && (
                    <div className="text-left md:text-right">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Score</p>
                      <p className={`text-xl font-black ${
                          (interview.overallScore || 0) >= 70 ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                      }`}>
                        {interview.overallScore || 0}%
                      </p>
                    </div>
                  )}
                  
                  <Link 
                    href={interview.status === 'completed' 
                      ? `/interview/${interview._id}/result` 
                      : `/interview/${interview._id}/session`
                    }
                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                        interview.status === 'completed'
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    }`}
                  >
                    {interview.status === 'completed' ? 'View Report' : 'Resume'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}