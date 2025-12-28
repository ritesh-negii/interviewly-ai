// src/app/interview/[id]/result/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Share2,
  Home,
  RotateCcw,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";

interface QuestionResult {
  id: string;
  question: string;
  userAnswer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface InterviewResult {
  id: string;
  type: string;
  role: string;
  date: string;
  duration: number;
  overallScore: number;
  categoryScores: {
    technical: number;
    communication: number;
    problemSolving: number;
    behavioral: number;
  };
  questions: QuestionResult[];
  aiSummary: string;
  recommendations: string[];
}

export default function InterviewResultPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load interview result
    const loadResult = async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult({
        id: params.id as string,
        type: "Technical Interview",
        role: "Frontend Developer",
        date: new Date().toISOString(),
        duration: 45,
        overallScore: 78,
        categoryScores: {
          technical: 85,
          communication: 72,
          problemSolving: 80,
          behavioral: 75,
        },
        questions: [
          {
            id: "1",
            question: "Explain the difference between var, let, and const in JavaScript.",
            userAnswer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned.",
            score: 85,
            feedback: "Good explanation covering the key differences. You could enhance by mentioning hoisting behavior.",
            strengths: ["Clear explanation", "Mentioned scoping differences"],
            improvements: ["Add hoisting details", "Provide code examples"],
          },
          {
            id: "2",
            question: "What is the virtual DOM and how does React use it?",
            userAnswer: "Virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates.",
            score: 75,
            feedback: "Solid understanding of the concept. Consider explaining the reconciliation process.",
            strengths: ["Understood core concept", "Mentioned optimization"],
            improvements: ["Explain reconciliation", "Discuss performance benefits"],
          },
          {
            id: "3",
            question: "Describe a challenging project you worked on and how you overcame obstacles.",
            userAnswer: "Built a real-time dashboard with WebSocket integration. Faced performance issues with large data sets.",
            score: 70,
            feedback: "Good use of STAR method. Expand on specific actions taken and measurable results.",
            strengths: ["Mentioned specific technology", "Identified challenges"],
            improvements: ["More detail on solutions", "Quantify impact"],
          },
        ],
        aiSummary: "Strong technical knowledge with good communication skills. Focus on providing more detailed examples and quantifying your impact. Your problem-solving approach is solid, but consider structuring behavioral responses more clearly using the STAR method.",
        recommendations: [
          "Practice explaining complex concepts with real-world examples",
          "Review React optimization techniques and performance best practices",
          "Prepare 3-5 detailed STAR stories for common behavioral questions",
          "Work on quantifying achievements with specific metrics",
        ],
      });

      setLoading(false);
    };

    loadResult();
  }, [isAuthenticated, router, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The interview results could not be loaded
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90"
          >
            <Home className="h-5 w-5" />
            Back to Dashboard
          </Link>
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

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <span>Interview Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Interview Results</h1>
          <p className="text-muted-foreground">
            {result.type} • {new Date(result.date).toLocaleDateString()}
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="relative mb-8 p-8 rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-secondary"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - result.overallScore / 100)}
                    className={getScoreColor(result.overallScore)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl md:text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}
                  </span>
                  <span className="text-sm text-muted-foreground">Score</span>
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {getScoreGrade(result.overallScore)}!
              </h2>
              <p className="text-muted-foreground mb-4">
                You completed the {result.type} in {result.duration} minutes
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium">
                  <Download className="h-4 w-4" />
                  Download Report
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors text-sm font-medium">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(result.categoryScores).map(([category, score]) => (
            <div key={category} className="p-6 rounded-2xl border bg-card">
              <p className="text-sm text-muted-foreground mb-2 capitalize">
                {category.replace(/([A-Z])/g, " $1").trim()}
              </p>
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </span>
                {score >= 75 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Summary */}
        <div className="mb-8 p-6 rounded-2xl border bg-card">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">AI Summary</h3>
              <p className="text-muted-foreground leading-relaxed">
                {result.aiSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Question Breakdown</h2>
          <div className="space-y-4">
            {result.questions.map((q, index) => (
              <div key={q.id} className="rounded-2xl border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                  className="w-full p-6 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${getScoreBgColor(q.score)}`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-2">{q.question}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${getScoreColor(q.score)}`}>
                          {q.score}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {expandedQuestion === q.id ? "Hide details" : "View details"}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedQuestion === q.id && (
                  <div className="px-6 pb-6 space-y-4 border-t">
                    <div className="pt-4">
                      <h4 className="font-semibold text-sm mb-2">Your Answer:</h4>
                      <p className="text-muted-foreground text-sm p-4 rounded-lg bg-secondary/50">
                        {q.userAnswer}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Feedback:</h4>
                      <p className="text-muted-foreground text-sm">{q.feedback}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-600">
                          <ThumbsUp className="h-4 w-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {q.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-yellow-600">
                          <ThumbsDown className="h-4 w-4" />
                          Areas to Improve
                        </h4>
                        <ul className="space-y-1">
                          {q.improvements.map((i, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                              {i}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8 p-6 rounded-2xl border bg-card">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Recommendations
          </h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <p className="text-muted-foreground text-sm pt-0.5">{rec}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/interview"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
            Practice Again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border rounded-xl font-semibold hover:bg-accent transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}