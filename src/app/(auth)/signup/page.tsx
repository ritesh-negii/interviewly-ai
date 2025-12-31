
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Brain, Mail, Lock, User, ArrowRight, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup(formData);
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
    
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10">
      
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow">
              <Brain className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl">
              <span className="text-primary">Interview</span>
              <span className="text-foreground">lyAI</span>
            </span>
          </Link>
        </div>

        
        <div className="rounded-2xl border-2 border-border bg-card/80 backdrop-blur-sm p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Create an account</h1>
            <p className="text-muted-foreground text-base">
              Start your journey to interview mastery
            </p>
          </div>

         
          <div className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="space-y-2">
              {[
                "AI-powered interview practice",
                "Instant feedback & scoring",
                "Track your progress"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
          
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold mb-2.5 text-foreground"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2.5 text-foreground"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

        
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2.5 text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-input bg-background pl-11 pr-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
                  placeholder="Create a strong password"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-1">
                Must be at least 6 characters
              </p>
            </div>

           
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-primary px-4 py-3.5 text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

      
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium">
                Already have an account?
              </span>
            </div>
          </div>

      
          <Link
            href="/login"
            className="block w-full text-center rounded-xl border-2 border-primary/20 bg-background/50 px-4 py-3 text-base font-bold text-foreground hover:bg-primary/5 hover:border-primary/40 transition-all"
          >
            Sign In Instead
          </Link>
        </div>

        
        <p className="mt-6 text-center text-sm text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}