// src/app/dashboard/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Brain,
  Award,
  Calendar,
  BarChart3,
  FileText,
  PlayCircle,
  Sparkles,
  AlertCircle,
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
  const { user, isAuthenticated } = useAuth();
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
   }

    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      // TODO: Replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      setStats({
        totalInterviews: 12,
        completedInterviews: 8,
        averageScore: 78,
        improvementRate: 15,
        practiceStreak: 5,
        totalMinutes: 180,
      });

      setRecentInterviews([
        {
          id: "1",
          type: "Technical",
          role: "Frontend Developer",
          score: 85,
          date: "2024-01-15",
          duration: 45,
          completed: true,
        },
        {
          id: "2",
          type: "Behavioral",
          role: "Product Manager",
          score: 72,
          date: "2024-01-14",
          duration: 30,
          completed: true,
        },
        {
          id: "3",
          type: "Technical",
          role: "Backend Developer",
          score: 0,
          date: "2024-01-13",
          duration: 0,
          completed: false,
        },
      ]);

      setLoading(false);
    };

  loadDashboardData();
 }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {stats.practiceStreak} day streak
              </span>
            </div>
          </div>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user?.name}</span>! Here's your interview practice overview.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link
            href="/interview"
            className="group relative flex items-center gap-4 p-6 rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <PlayCircle className="h-7 w-7" />
            </div>
            <div className="relative flex-1">
              <h3 className="font-semibold text-lg mb-1">Start Interview</h3>
              <p className="text-sm text-muted-foreground">Practice now</p>
            </div>
            <ArrowRight className="relative h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/resume"
            className="group relative flex items-center gap-4 p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
              <FileText className="h-7 w-7 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Upload Resume</h3>
              <p className="text-sm text-muted-foreground">Update profile</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/profile"
            className="group relative flex items-center gap-4 p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02] sm:col-span-2 lg:col-span-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
              <BarChart3 className="h-7 w-7 text-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">View Progress</h3>
              <p className="text-sm text-muted-foreground">Detailed analytics</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Target className="h-6 w-6" />}
            label="Total Interviews"
            value={stats.totalInterviews.toString()}
            subtext={`${stats.completedInterviews} completed`}
            color="blue"
          />
          <StatCard
            icon={<Award className="h-6 w-6" />}
            label="Average Score"
            value={`${stats.averageScore}%`}
            subtext={`+${stats.improvementRate}% this week`}
            color="green"
          />
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            label="Practice Time"
            value={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
            subtext="Total time"
            color="purple"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Improvement"
            value={`${stats.improvementRate}%`}
            subtext="Last 7 days"
            color="orange"
          />
        </div>

        {/* Recent Interviews */}
        <div className="bg-card rounded-2xl border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Recent Interviews</h2>
              <p className="text-sm text-muted-foreground">
                Your latest practice sessions
              </p>
            </div>
            <Link
              href="/interview"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {recentInterviews.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No interviews yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your first interview practice session
              </p>
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <PlayCircle className="h-5 w-5" />
                Start Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border bg-background hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{interview.role}</h3>
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                        {interview.type}
                      </span>
                      {!interview.completed && (
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                          In Progress
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {new Date(interview.date).toLocaleDateString()}
                      </span>
                      {interview.completed && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {interview.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                  {interview.completed ? (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getScoreBgColor(interview.score)}`}>
                      <Award className={`h-5 w-5 ${getScoreColor(interview.score)}`} />
                      <span className={`font-bold text-lg ${getScoreColor(interview.score)}`}>
                        {interview.score}%
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={`/interview/${interview.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground flex-shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Tip of the Day</h3>
              <p className="text-muted-foreground mb-4">
                Practice the STAR method (Situation, Task, Action, Result) for behavioral questions. This structured approach helps you deliver clear, compelling answers that showcase your experience effectively.
              </p>
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Practice now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10 from-primary/20 to-primary/5" />
      <div className="flex flex-col p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300">
        <div className={`inline-flex w-fit p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} mb-4 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </div>
    </div>
  );
}