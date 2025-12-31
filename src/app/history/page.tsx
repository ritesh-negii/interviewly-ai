"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { api } from "@/lib/api";
import { Calendar, CheckCircle, Clock, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Interview History
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No interviews yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Start your first AI mock interview today.</p>
            <Link href="/interview" className="px-6 py-2 bg-primary text-white rounded-md font-bold hover:bg-primary/90">
              Start Interview
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {interviews.map((interview: any) => (
              <div 
                key={interview._id} 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    interview.status === 'completed' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}>
                    {interview.status === 'completed' ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white capitalize">
                      {interview.type} Interview
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                      <span className="capitalize px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                        {interview.difficulty}
                      </span>
                      {interview.status !== 'completed' && (
                         <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs font-bold">
                            <AlertTriangle className="h-3 w-3" /> In Progress
                         </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                  {interview.status === 'completed' && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 uppercase font-bold">Score</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {interview.overallScore || 0}/100
                      </p>
                    </div>
                  )}
                  
                  <Link 
                    href={interview.status === 'completed' 
                      ? `/interview/${interview._id}/result` 
                      : `/interview/${interview._id}/session`
                    }
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                        interview.status === 'completed'
                        ? "text-primary bg-primary/10 hover:bg-primary/20"
                        : "text-white bg-primary hover:bg-primary/90 shadow-sm"
                    }`}
                  >
                    {interview.status === 'completed' ? 'View Report' : 'Resume Interview'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}