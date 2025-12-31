"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  LogOut,
  SkipForward,
  Brain,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from "lucide-react";

export default function InterviewSessionPage() {
  const params = useParams();
  const id = params?.id as string; 
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  
  const [currentQNum, setCurrentQNum] = useState(1);
  const [totalQNum, setTotalQNum] = useState(5);

 
  const [startTime, setStartTime] = useState<number>(Date.now());

  const loadQuestion = async () => {
    setLoading(true);
    try {
      if (!id) return;

      const res: any = await api.post(`/api/interview/${id}/question`, {});
      
      if (res.completed) {
        router.push(`/interview/${id}/result`);
        return;
      }
      
      setQuestion(res.question);
      setCurrentQNum(res.questionNumber || 1);
      setTotalQNum(res.totalQuestions || 5);
      
      setFeedback(null);
      setAnswer("");

      
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error loading question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
        loadQuestion();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);


    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    try {
      const res: any = await api.post(`/api/interview/${id}/answer`, {
        questionId: question.id,
        answer: answer,
        timeSpent: timeSpent // 
      });

      setFeedback(res.evaluation);
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false);
    }
  };


  
  const handleSkip = async () => {
    if (!confirm("Are you sure you want to skip? This will be marked as a 0 score.")) return;
    
    setSkipping(true);
    try {
        const res: any = await api.post(`/api/interview/${id}/skip`, {});
        if (res.isComplete) {
            router.push(`/interview/${id}/result`);
        } else {
            await loadQuestion();
        }
    } catch (error) {
        console.error("Error skipping:", error);
    } finally {
        setSkipping(false);
    }
  };

  const handleQuit = () => {
    if(confirm("Are you sure you want to quit? Your progress will be saved but the session will be incomplete.")) {
        router.push("/dashboard");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-700 dark:text-green-600 bg-green-100 dark:bg-green-500/10 border-green-300 dark:border-green-500/20";
    if (score >= 6) return "text-blue-700 dark:text-blue-600 bg-blue-100 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20";
    if (score >= 4) return "text-yellow-700 dark:text-yellow-600 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-300 dark:border-yellow-500/20";
    return "text-red-700 dark:text-red-600 bg-red-100 dark:bg-red-500/10 border-red-300 dark:border-red-500/20";
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-gradient-to-b dark:from-background dark:via-background dark:to-secondary/20 flex flex-col font-sans">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-200 dark:border-border flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm dark:shadow-lg">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-foreground tracking-tight flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Live Interview
                </div>
                <div className="text-xs text-slate-600 dark:text-muted-foreground hidden sm:block">AI-Powered Session</div>
              </div>
            </div>
            
            <div className="hidden sm:block h-10 w-px bg-slate-200 dark:bg-border" />
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>In Progress</span>
            </div>
          </div>

          <button 
            onClick={handleQuit}
            className="px-3 sm:px-4 py-2 text-sm font-semibold text-slate-600 dark:text-muted-foreground hover:text-red-600 dark:hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all rounded-lg flex items-center gap-2 border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">End Session</span>
          </button>
        </header>

        {/* Progress Bar */}
        <div className="relative w-full bg-slate-200 dark:bg-secondary/50 h-2">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500 shadow-sm"
            style={{ width: `${(currentQNum / totalQNum) * 100}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-700 dark:text-foreground/50 bg-white/90 dark:bg-background/80 px-2 rounded shadow-sm">
              {currentQNum}/{totalQNum}
            </span>
          </div>
        </div>

    
        <main className="flex-1 container max-w-5xl mx-auto p-4 sm:p-6 md:p-10 flex flex-col">
          
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-6 py-20 animate-in fade-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                <Loader2 className="relative h-16 w-16 text-blue-600 animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-slate-900 dark:text-foreground text-xl font-bold">Preparing Your Question</p>
                <p className="text-slate-600 dark:text-muted-foreground">AI is crafting the perfect challenge...</p>
              </div>
            </div>
          )}

          {!loading && question && (
            <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Question Card */}
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-600 uppercase tracking-wider block">
                        Question {currentQNum} of {totalQNum}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-muted-foreground">Keep going, you're doing great!</span>
                    </div>
                  </div>
                  {question.difficulty && (
                    <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-secondary px-3 py-1.5 rounded-full text-slate-700 dark:text-muted-foreground border border-slate-200 dark:border-border">
                      {question.difficulty}
                    </span>
                  )}
                </div>
                
                <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 dark:border-border bg-white dark:bg-card/80 backdrop-blur-sm shadow-lg dark:shadow-xl">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-slate-900 dark:text-foreground">
                    {question.text}
                  </h1>
                </div>
              </div>

              {/* Answer Area */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your professional response here... Be detailed and specific."
                    disabled={!!feedback || submitting || skipping}
                    className="w-full h-64 sm:h-80 p-5 sm:p-6 rounded-2xl border-2 border-slate-200 dark:border-border bg-white dark:bg-card resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-base sm:text-lg leading-relaxed text-slate-900 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted-foreground shadow-md dark:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-card/50"
                  />
                  {!feedback && (
                    <div className="absolute bottom-4 right-4 text-xs text-slate-500 dark:text-muted-foreground bg-white/90 dark:bg-background/80 px-2 py-1 rounded shadow-sm border border-slate-200 dark:border-border/50">
                      {answer.length} characters
                    </div>
                  )}
                </div>
                
             
                {!feedback && (
                  <div className="flex items-center justify-between gap-4 pt-2">
                    <button
                      onClick={handleSkip}
                      disabled={submitting || skipping}
                      className="px-4 sm:px-6 py-3 rounded-xl text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-secondary hover:text-slate-900 dark:hover:text-foreground transition-all flex items-center gap-2 font-semibold border-2 border-transparent hover:border-slate-200 dark:hover:border-border disabled:opacity-50"
                    >
                      {skipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <SkipForward className="h-4 w-4" />}
                      <span className="hidden sm:inline">Skip Question</span>
                    </button>

         
                    <button
                      onClick={handleSubmit}
                      disabled={!answer.trim() || submitting || skipping}
                      className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl disabled:opacity-50 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 font-bold text-base hover:scale-105 active:scale-95"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Answer</span>
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Feedback Card */}
              {feedback && (
                <div className="bg-white dark:bg-card rounded-3xl border-2 border-slate-200 dark:border-border shadow-xl dark:shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 mb-12">
                  <div className="p-6 sm:p-8 border-b-2 border-slate-200 dark:border-border bg-slate-50 dark:bg-gradient-to-r dark:from-secondary/30 dark:to-secondary/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                        <Sparkles className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl sm:text-2xl text-slate-900 dark:text-foreground">AI Evaluation</h3>
                        <p className="text-sm text-slate-600 dark:text-muted-foreground">Detailed feedback on your response</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getScoreColor(feedback.score)}`}>
                        <Award className="h-5 w-5" />
                        <span className="text-3xl font-black">{feedback.score}</span>
                        <span className="text-lg font-bold">/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-secondary/30 border-2 border-slate-200 dark:border-border">
                      <p className="text-base sm:text-lg text-slate-800 dark:text-foreground leading-relaxed">{feedback.feedback}</p>
                    </div>
                    
                    {(feedback.strengths?.length > 0 || feedback.improvements?.length > 0) && (
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                        {feedback.strengths?.length > 0 && (
                          <div className="bg-green-50 dark:bg-gradient-to-br dark:from-green-950/20 dark:to-emerald-950/20 p-5 rounded-2xl border-2 border-green-200 dark:border-green-500/20">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                              <p className="font-bold text-green-700 dark:text-green-600">Strong Points</p>
                            </div>
                            <ul className="space-y-2.5">
                              {feedback.strengths.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-slate-700 dark:text-foreground/80 flex items-start gap-2.5">
                                  <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {feedback.improvements?.length > 0 && (
                          <div className="bg-orange-50 dark:bg-gradient-to-br dark:from-orange-950/20 dark:to-red-950/20 p-5 rounded-2xl border-2 border-orange-200 dark:border-orange-500/20">
                            <div className="flex items-center gap-2 mb-4">
                              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                              <p className="font-bold text-orange-700 dark:text-orange-600">Growth Areas</p>
                            </div>
                            <ul className="space-y-2.5">
                              {feedback.improvements.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-slate-700 dark:text-foreground/80 flex items-start gap-2.5">
                                  <span className="mt-1.5 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Continue Button - Fixed Visibility */}
                    <button
                      onClick={loadQuestion}
                      className="w-full py-4 sm:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <span>Continue to Next Question</span>
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}