"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Target,
  Award,
  BarChart3,
  FileText,
  PlayCircle,
  Loader2,
  CheckCircle,
  Sparkles,
  Calendar,
  Trophy,
  Zap
} from "lucide-react";

interface DashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
  improvementRate: number;
  practiceStreak: number;
  totalMinutes: number;
}

interface RecentInterview {
  id: string;
  type: string;
  role: string;
  score: number;
  date: string;
  duration: number;
  completed: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    improvementRate: 0,
    practiceStreak: 0,
    totalMinutes: 0,
  });
  const [recentInterviews, setRecentInterviews] = useState<RecentInterview[]>([]);
  const [loading, setLoading] = useState(true);

  const handleStartInterview = () => {
    if (user?.resumeUploaded) {
      router.push("/interview/ai-powered/start");
    } else {
      const wantToUpload = window.confirm(
        "💡 Pro Tip: Uploading a resume unlocks personalized questions.\n\nClick OK to Upload Resume.\nClick Cancel to start a generic Technical Interview."
      );

      if (wantToUpload) {
        router.push("/resume");
      } else {
        router.push("/interview/technical/start");
      }
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data: any = await api.get("/api/dashboard/stats");
        
        if (data && data.stats) {
            setStats(data.stats);
            setRecentInterviews(data.recentInterviews);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex flex-col">
        <Navbar />
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-600/10 border-2 border-primary/20 p-6 sm:p-8">
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Welcome Back</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-1">
                    Hey, {user?.name}! 👋
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Ready to level up your interview skills today?
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-border/50">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Current Streak</p>
                    <p className="text-lg font-bold text-foreground">{stats.practiceStreak} Days 🔥</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                onClick={handleStartInterview}
                className="group relative p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 hover:from-primary/10 hover:to-purple-500/10 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col gap-3 text-left cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-1">Start Interview</h3>
                  <p className="text-sm text-muted-foreground mb-3">Practice with AI now</p>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    <span>Let's go</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
              
              <Link 
                href="/resume" 
                className={`group relative p-6 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col gap-3 overflow-hidden ${
                  user?.resumeUploaded 
                    ? "border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20" 
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500 ${
                  user?.resumeUploaded ? "bg-green-500/10" : "bg-secondary/50"
                }`} />
                <div className="relative z-10">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 shadow-md ${
                    user?.resumeUploaded 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" 
                      : "bg-secondary text-foreground"
                  }`}>
                    {user?.resumeUploaded ? <CheckCircle className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-1">
                    {user?.resumeUploaded ? "Resume Uploaded ✓" : "Upload Resume"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.resumeUploaded 
                      ? "Update or replace your resume" 
                      : "Unlock personalized questions"}
                  </p>
                </div>
              </Link>

              <Link 
                href="/history"
                className="group relative p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col gap-3 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/50 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3 shadow-md">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-1">View History</h3>
                  <p className="text-sm text-muted-foreground">Track your progress</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Your Performance
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                icon={<Target />} label="Total Interviews" value={stats.totalInterviews} 
                gradient="from-blue-500 to-cyan-500" bgColor="bg-blue-50 dark:bg-blue-950/20"
              />
              <StatCard 
                icon={<Award />} label="Avg. Score" value={`${stats.averageScore}%`} 
                gradient="from-green-500 to-emerald-500" bgColor="bg-green-50 dark:bg-green-950/20"
              />
              <StatCard 
                icon={<Clock />} label="Practice Time" 
                value={`${Math.floor(stats.totalMinutes/60)}h ${stats.totalMinutes%60}m`} 
                gradient="from-purple-500 to-pink-500" bgColor="bg-purple-50 dark:bg-purple-950/20"
              />
              <StatCard 
                icon={<TrendingUp />} label="Current Streak" value={`${stats.practiceStreak} Days`} 
                gradient="from-orange-500 to-red-500" bgColor="bg-orange-50 dark:bg-orange-950/20"
              />
            </div>
          </div>

          {/* Recent Interviews List */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
              {recentInterviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                    <PlayCircle className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">No interviews yet</h3>
                  <p className="text-muted-foreground mb-6">Start your first interview to track your progress!</p>
                  <button 
                    onClick={handleStartInterview}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    <PlayCircle className="h-5 w-5" /> Start Interview
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentInterviews.map((interview) => (
                    <div 
                      key={interview.id} 
                      className="group flex items-center justify-between p-5 border-2 border-border rounded-xl hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                          interview.completed 
                            ? interview.score >= 80 
                              ? "bg-green-100 dark:bg-green-950/30" 
                              : "bg-yellow-100 dark:bg-yellow-950/30"
                            : "bg-blue-100 dark:bg-blue-950/30"
                        }`}>
                          {interview.completed ? (
                            <Award className={`h-6 w-6 ${interview.score >= 80 ? "text-green-600" : "text-yellow-600"}`} />
                          ) : (
                            <Clock className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground capitalize group-hover:text-primary transition-colors">
                            {interview.type} Interview
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(interview.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              
                              {interview.duration || 1} mins
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {interview.completed ? (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${interview.score >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                              {interview.score}%
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        ) : (
                          <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full">
                            In Progress
                          </span>
                        )}
                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ icon, label, value, gradient, bgColor }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500`} />
      <div className="relative z-10 flex flex-col gap-2">
        <div className={`w-fit p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg mb-2`}>
          <div className="text-white">{icon}</div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-extrabold text-foreground">{value}</p>
      </div>
    </div>
  );
}