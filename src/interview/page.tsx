// src/app/interview/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  Brain,
  Users,
  Code,
  MessageSquare,
  ArrowRight,
  Clock,
  Target,
  Sparkles,
  ChevronRight,
  FileText,
  AlertCircle,
} from "lucide-react";

interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: number;
  color: string;
}

export default function InterviewPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if user has uploaded resume
    // TODO: Replace with actual API call
    setHasResume(true);
  }, [isAuthenticated, router]);

  const interviewTypes: InterviewType[] = [
    {
      id: "technical",
      title: "Technical Interview",
      description: "Practice coding problems, algorithms, and system design questions",
      icon: <Code className="h-8 w-8" />,
      duration: "45-60 min",
      difficulty: "Intermediate",
      questions: 5-8,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description: "Master STAR method responses and soft skills questions",
      icon: <Users className="h-8 w-8" />,
      duration: "30-45 min",
      difficulty: "Beginner",
      questions: 8-10,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "ai-powered",
      title: "AI-Powered Mock",
      description: "Dynamic interview with personalized questions based on your resume",
      icon: <Brain className="h-8 w-8" />,
      duration: "60 min",
      difficulty: "Advanced",
      questions: 10-12,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const handleStartInterview = (typeId: string) => {
    if (!hasResume && typeId === "ai-powered") {
      alert("Please upload your resume first to use AI-Powered interviews");
      router.push("/resume");
      return;
    }
    router.push(`/interview/${typeId}/start`);
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Beginner") return "text-green-600 bg-green-500/10 border-green-500/20";
    if (difficulty === "Intermediate") return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-600 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Start Interview Practice</h1>
          <p className="text-muted-foreground">
            Choose an interview type and begin improving your skills
          </p>
        </div>

        {/* Resume Alert */}
        {!hasResume && (
          <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                Upload your resume to unlock AI-powered personalized interviews
              </p>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 text-sm font-medium text-yellow-600 hover:underline"
              >
                Upload Resume
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Interview Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {interviewTypes.map((type) => (
            <div
              key={type.id}
              className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
                selectedType === type.id ? "ring-2 ring-primary" : ""
              } ${type.id === "ai-powered" && !hasResume ? "opacity-60" : ""}`}
              onClick={() => setSelectedType(type.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10 from-primary/20 to-primary/5" />
              
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${type.color} mb-4 shadow-lg`}>
                <div className="text-white">{type.icon}</div>
              </div>

              <h3 className="text-xl font-bold mb-2">{type.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {type.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{type.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{type.questions} questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(type.difficulty)}`}>
                    {type.difficulty}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleStartInterview(type.id)}
                disabled={type.id === "ai-powered" && !hasResume}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="h-5 w-5" />
                Start Interview
              </button>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-card rounded-2xl border p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Interview Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Find a quiet space with good internet connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Take time to think before answering each question</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Use the STAR method for behavioral questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Review feedback after each session to improve</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}