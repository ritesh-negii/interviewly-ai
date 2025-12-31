"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Brain, Target, Sparkles, TrendingUp, Star, CheckCircle2, Zap, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 md:py-28 lg:py-36 overflow-hidden">
        {/* Simplified background with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container max-w-6xl relative z-10">
          <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="font-semibold text-primary">
                  AI-Powered Interview Mastery
                </span>
              </div>
            </div>

            {/* Heading */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-3 sm:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.1] px-4">
                <span className="block text-foreground mb-2">Master Your</span>
                <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Interview Skills
                </span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground/70">
                Practice smarter, perform better
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 px-4">
              Get personalized interview practice with AI-driven questions, instant feedback, and real-time coaching tailored to your dream role.
            </p>

            {/* CTA Buttons - Fixed for dark mode */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 w-full max-w-sm sm:max-w-none mx-auto px-4">
              {!isAuthenticated && (
                <>
                  <Link
                    href="/signup"
                    className="group relative inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-primary-foreground shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 sm:min-w-[240px]"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      Start Practicing Free
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl sm:rounded-2xl border-2 border-primary/20 bg-card hover:bg-accent px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-foreground transition-all duration-300 hover:scale-105 hover:border-primary/40 sm:min-w-[240px] shadow-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
              
              {isAuthenticated && (
                 <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-primary-foreground shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 sm:min-w-[240px]"
                  >
                    <span className="flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
              )}
            </div>

            {/* Enhanced Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-8 sm:pt-10 animate-in fade-in duration-1000 delay-300 px-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    'bg-gradient-to-br from-blue-500 to-cyan-500',
                    'bg-gradient-to-br from-purple-500 to-pink-500',
                    'bg-gradient-to-br from-orange-500 to-red-500',
                    'bg-gradient-to-br from-green-500 to-emerald-500'
                  ].map((gradient, i) => (
                    <div
                      key={i}
                      className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full border-3 border-background ${gradient} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {['👨', '👩', '🧑', '👤'][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-foreground">10,000+ professionals</p>
                  <p className="text-xs text-muted-foreground">practicing daily</p>
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-foreground">4.9/5 rating</p>
                  <p className="text-xs text-muted-foreground">500+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 sm:py-12 px-4 sm:px-6 border-y bg-secondary/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: '50K+', label: 'Practice Sessions' },
              { value: '95%', label: 'Success Rate' },
              { value: '200+', label: 'Companies' },
              { value: '24/7', label: 'AI Support' }
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/30">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-primary">
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold px-4 text-foreground">
              Why Choose{' '}
              <span className="text-primary">InterviewlyAI</span>?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Everything you need to ace your next interview, powered by advanced AI
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              icon={<Brain className="h-7 w-7 sm:h-8 sm:w-8" />}
              title="AI-Powered Questions"
              description="Get personalized interview questions based on your resume, skills, and target role with intelligent difficulty scaling."
              gradient="from-blue-500 via-cyan-500 to-blue-600"
              features={['Role-specific questions', 'Resume analysis', 'Adaptive difficulty']}
            />
            <FeatureCard
              icon={<Target className="h-7 w-7 sm:h-8 sm:w-8" />}
              title="Real-time Feedback"
              description="Receive instant, detailed evaluation with actionable suggestions and improvements for every answer you provide."
              gradient="from-purple-500 via-pink-500 to-purple-600"
              features={['Instant scoring', 'Detailed analysis', 'Improvement tips']}
            />
            <FeatureCard
              icon={<TrendingUp className="h-7 w-7 sm:h-8 sm:w-8" />}
              title="Track Progress"
              description="Monitor your performance over time with comprehensive analytics, charts, and identify key areas for improvement."
              gradient="from-orange-500 via-red-500 to-orange-600"
              features={['Performance metrics', 'Progress charts', 'Weak spot detection']}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-600/10 p-8 sm:p-12 md:p-16 text-center shadow-2xl">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />
            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 border-2 border-primary/20">
                <Award className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Join thousands of professionals who've landed their dream jobs with InterviewlyAI
              </p>
              {!isAuthenticated && (
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Get Started for Free
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 sm:py-12 px-4 sm:px-6 border-t bg-secondary/50">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-bold">
                <span className="text-primary">Interview</span>
                <span className="text-foreground">lyAI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2024 InterviewlyAI. All rights reserved. Empowering careers through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  features: string[];
}) {
  return (
    <div className="group relative">
      <div className={`absolute -inset-1 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl sm:rounded-3xl blur-lg`} />
      <div className="relative flex flex-col p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-border bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
        <div className={`inline-flex w-fit p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} mb-4 sm:mb-6 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 text-foreground">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6 flex-grow">
          {description}
        </p>
        <div className="space-y-2 pt-3 sm:pt-4 border-t border-border">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}