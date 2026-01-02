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
  Sparkles,
  ChevronRight,
  AlertCircle,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
} from "lucide-react";

interface InterviewType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  questions: string;
  color: string;
}

export default function InterviewPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hasResume, setHasResume] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);


  const interviewTypes: InterviewType[] = [
    {
      id: "ai-powered",
      title: "AI-Powered Mock",
      description: "Dynamic interview with personalized questions based on your resume",
      icon: <Brain className="h-8 w-8" />,
      duration: "60 min",
      difficulty: "Advanced",
      questions: "10-12",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "technical",
      title: "Technical Interview",
      description: "Practice coding problems, algorithms, and system design questions",
      icon: <Code className="h-8 w-8" />,
      duration: "45-60 min",
      difficulty: "Intermediate",
      questions: "3",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description: "Master STAR method responses and soft skills questions",
      icon: <Users className="h-8 w-8" />,
      duration: "30-45 min",
      difficulty: "Beginner",
      questions: "8-10",
      color: "from-purple-500 to-pink-500",
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
      
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Dashboard
          </Link>
          <div className="flex items-start gap-4">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Start Interview Practice</h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Choose an interview type and begin improving your skills
              </p>
            </div>
          </div>
        </div>

    
        {!hasResume && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/20 flex items-start gap-4 shadow-lg">
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">Unlock AI-Powered Interviews</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Upload your resume to get personalized questions tailored to your experience and skills
              </p>
              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition-all hover:scale-105 text-sm shadow-md"
              >
                <Sparkles className="h-4 w-4" />
                Upload Resume Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

  
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {interviewTypes.map((type) => (
            <div
              key={type.id}
              className={`group relative rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden ${
                selectedType === type.id
                  ? "ring-4 ring-primary/50 border-primary shadow-xl shadow-primary/20"
                  : "border-border hover:border-primary/50"
              } ${type.id === "ai-powered" && !hasResume ? "opacity-60" : ""}`}
              onClick={() => setSelectedType(type.id)}
            >
        
              <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

          
              {type.id === "ai-powered" && !hasResume && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-bold text-yellow-700 dark:text-yellow-400">
                  🔒 Resume Required
                </div>
              )}

              <div className="relative z-10">
          
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${type.color} mb-5 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{type.icon}</div>
                </div>

            
                <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed min-h-[60px]">
                  {type.description}
                </p>

                
                <div className="space-y-2.5 mb-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{type.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>{type.questions} questions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 ${getDifficultyColor(type.difficulty)}`}>
                      {type.difficulty}
                    </span>
                  </div>
                </div>

            
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartInterview(type.id);
                  }}
                  disabled={type.id === "ai-powered" && !hasResume}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Interview</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        
        <div className="grid md:grid-cols-2 gap-6">
        
          <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 flex-shrink-0 shadow-lg">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-foreground">Interview Tips</h3>
                <p className="text-sm text-muted-foreground">Best practices for success</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Find a quiet space with good internet connection",
                "Take time to think before answering each question",
                "Use the STAR method for behavioral questions",
                "Practice out loud to build confidence"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-foreground">What to Expect</h3>
                <p className="text-sm text-muted-foreground">How interviews work</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "AI-generated questions tailored to the role",
                "Instant feedback on your responses",
                "Detailed scoring and improvement tips",
                "Track your progress over time"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <div className="flex-shrink-0 h-6 w-6 rounded-lg bg-green-500/10 flex items-center justify-center mt-0.5">
                    <ChevronRight className="h-4 w-4 text-green-600" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}