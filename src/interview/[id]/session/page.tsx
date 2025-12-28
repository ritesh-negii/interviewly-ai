// src/app/interview/[id]/session/page.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Clock,
  ChevronRight,
  ChevronLeft,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  CheckCircle,
  Sparkles,
  Flag,
  List,
  X,
  AlertCircle,
  Pause,
  Play,
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  hint?: string;
}

interface Answer {
  questionId: string;
  text: string;
  timestamp: string;
  flagged: boolean;
}

export default function InterviewSessionPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showQuestionNav, setShowQuestionNav] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load interview questions
    const loadQuestions = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setQuestions([
          {
            id: "1",
            text: "Explain the difference between var, let, and const in JavaScript. When would you use each?",
            category: "Technical - JavaScript",
            difficulty: "Intermediate",
            hint: "Think about scope, reassignment, and hoisting",
          },
          {
            id: "2",
            text: "What is the virtual DOM in React and why is it useful for performance?",
            category: "Technical - React",
            difficulty: "Intermediate",
            hint: "Consider how React updates the UI efficiently",
          },
          {
            id: "3",
            text: "Tell me about a time when you had to debug a difficult issue. How did you approach it?",
            category: "Behavioral",
            difficulty: "Beginner",
            hint: "Use the STAR method: Situation, Task, Action, Result",
          },
          {
            id: "4",
            text: "How would you optimize the performance of a React application?",
            category: "Technical - React",
            difficulty: "Advanced",
            hint: "Think about memoization, code splitting, lazy loading",
          },
          {
            id: "5",
            text: "Describe a situation where you disagreed with a team member. How did you resolve it?",
            category: "Behavioral",
            difficulty: "Intermediate",
            hint: "Focus on communication and conflict resolution",
          },
          {
            id: "6",
            text: "Explain how closures work in JavaScript with an example.",
            category: "Technical - JavaScript",
            difficulty: "Advanced",
            hint: "Think about lexical scoping and function references",
          },
          {
            id: "7",
            text: "What's your approach to learning new technologies?",
            category: "Behavioral",
            difficulty: "Beginner",
            hint: "Share specific examples and methods you use",
          },
          {
            id: "8",
            text: "Design a URL shortener system. What are the key components?",
            category: "System Design",
            difficulty: "Advanced",
            hint: "Consider hashing, database design, and scalability",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Failed to load questions:", error);
        router.push("/interview");
      }
    };

    loadQuestions();
  }, [isAuthenticated, router]);

  // Timer management
  useEffect(() => {
    if (loading || submitting || isPaused) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [loading, submitting, isPaused]);

  // Auto-save current answer
  useEffect(() => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    const saveTimeout = setTimeout(() => {
      saveCurrentAnswer();
    }, 2000); // Auto-save after 2 seconds of no typing

    return () => clearTimeout(saveTimeout);
  }, [currentAnswer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  const saveCurrentAnswer = () => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        text: currentAnswer,
        timestamp: new Date().toISOString(),
        flagged: flaggedQuestions.has(currentQuestion.id),
      },
    }));
  };

  const handleNavigateToQuestion = (index: number) => {
    saveCurrentAnswer();
    setCurrentQuestionIndex(index);
    const question = questions[index];
    setCurrentAnswer(answers[question.id]?.text || "");
    setShowQuestionNav(false);
  };

  const handleNext = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestion = questions[currentQuestionIndex + 1];
      setCurrentAnswer(answers[nextQuestion.id]?.text || "");
    }
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQuestion = questions[currentQuestionIndex - 1];
      setCurrentAnswer(answers[prevQuestion.id]?.text || "");
    }
  };

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleAutoSubmit = () => {
    console.log("Time expired - auto submitting");
    handleSubmit();
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((q) => !answers[q.id]?.text?.trim());
    
    if (unanswered.length > 0 && timeRemaining > 0) {
      const confirmSubmit = confirm(
        `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    saveCurrentAnswer();

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to results
      router.push(`/interview/${params.id}/result`);
    } catch (error) {
      alert("Failed to submit interview. Please try again.");
      setSubmitting(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording
    if (!isRecording) {
      console.log("Started recording...");
    } else {
      console.log("Stopped recording");
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // TODO: Implement text-to-speech
    if (!isSpeaking) {
      console.log("Reading question aloud...");
    } else {
      console.log("Stopped speaking");
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.values(answers).filter((a) => a.text.trim()).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <CheckCircle className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">Submitting Your Interview</h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your responses and generating personalized feedback. This may take a moment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Timer & Progress */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className={`h-5 w-5 ${timeRemaining < 300 ? "text-red-500 animate-pulse" : "text-primary"}`} />
                <span className={`font-mono font-bold text-lg ${timeRemaining < 300 ? "text-red-500" : ""}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{answeredCount}/{questions.length}</span>
                <span>answered</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQuestionNav(!showQuestionNav)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                title="Question navigator"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Navigator Sidebar */}
      {showQuestionNav && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setShowQuestionNav(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-background border-l shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Questions</h3>
                <button
                  onClick={() => setShowQuestionNav(false)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {questions.map((q, index) => {
                  const isAnswered = answers[q.id]?.text?.trim();
                  const isCurrent = index === currentQuestionIndex;
                  const isFlagged = flaggedQuestions.has(q.id);

                  return (
                    <button
                      key={q.id}
                      onClick={() => handleNavigateToQuestion(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isCurrent
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isAnswered
                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            Question {index + 1}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {q.category}
                          </p>
                        </div>
                        {isFlagged && (
                          <Flag className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                        {isAnswered && (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="fixed inset-0 z-30 bg-black/80 flex items-center justify-center">
            <div className="bg-background p-8 rounded-2xl border shadow-2xl text-center max-w-md">
              <Pause className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Interview Paused</h2>
              <p className="text-muted-foreground mb-6">
                Timer is paused. Click resume when you're ready to continue.
              </p>
              <button
                onClick={() => setIsPaused(false)}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Resume Interview
              </button>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="mb-6 p-6 md:p-8 rounded-2xl border bg-card">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0 font-bold text-lg">
                {currentQuestionIndex + 1}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                    {currentQuestion.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>
            </div>
            <button
              onClick={toggleFlag}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                flaggedQuestions.has(currentQuestion.id)
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Flag for review"
            >
              <Flag className={`h-5 w-5 ${flaggedQuestions.has(currentQuestion.id) ? "fill-yellow-500" : ""}`} />
            </button>
          </div>

          {/* Hint */}
          {currentQuestion.hint && (
            <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="inline h-4 w-4 mr-1 text-primary" />
                <span className="font-medium">Hint:</span> {currentQuestion.hint}
              </p>
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={toggleSpeaking}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                isSpeaking
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-accent"
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  Stop Reading
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Read Question
                </>
              )}
            </button>
            <button
              onClick={toggleRecording}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-background hover:bg-accent"
              }`}
            >
              {isRecording ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Voice Answer
                </>
              )}
            </button>
          </div>

          {/* Answer Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Answer</label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here... (Answers are auto-saved)"
              rows={12}
              className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground">
                {currentAnswer.length} characters
              </p>
              {currentAnswer.length > 0 && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Auto-saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <span>Finish</span>
              <Send className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}