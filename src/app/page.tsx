// src/app/page.tsx
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Brain, Target, Sparkles, TrendingUp, Award, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section - Redesigned */}
      <section className="relative flex-1 flex items-center justify-center px-6 py-24 md:py-32 lg:py-40 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container max-w-6xl relative z-10">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            {/* Badge - More subtle */}
            <div className="flex justify-center animate-in fade-in slide-in-from-bottom-3 duration-500">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium text-primary">AI-Powered Interview Practice</span>
              </div>
            </div>

            {/* Heading - Simplified and clear */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-4">
                Master Your Interview Skills
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary">
                with AI Coaching
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
              Practice technical, behavioral, and role-specific interviews with AI coaching. Get instant feedback and improve faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 w-full max-w-md sm:max-w-none mx-auto">
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 sm:min-w-[220px]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Practicing Free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm px-8 py-3.5 text-base font-semibold hover:bg-accent hover:border-primary/40 transition-all duration-300 hover:scale-105 sm:min-w-[220px]"
              >
                Sign In
              </Link>
            </div>

            {/* Social Proof - Redesigned */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in duration-1000 delay-300">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/70 to-primary/40 flex items-center justify-center"
                    >
                      <span className="text-xs font-bold text-white">{i === 1 ? '😊' : i === 2 ? '🎯' : i === 3 ? '💼' : '✨'}</span>
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">1,000+ users</p>
                  <p className="text-xs text-muted-foreground">practicing daily</p>
                </div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">4.9/5 rating</p>
                  <p className="text-xs text-muted-foreground">from our users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 px-6 bg-secondary/30">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">InterviewlyAI</span>?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to ace your next interview, powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-10 w-10" />}
              title="AI-Powered Questions"
              description="Get personalized interview questions based on your resume, skills, and target role."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Target className="h-10 w-10" />}
              title="Real-time Feedback"
              description="Receive instant, detailed evaluation and actionable suggestions to improve your answers."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10" />}
              title="Track Progress"
              description="Monitor your performance over time with detailed analytics and identify areas for improvement."
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            <StepCard
              number="1"
              title="Upload Your Resume"
              description="Upload your resume and let our AI analyze your skills, experience, and career goals."
            />
            <StepCard
              number="2"
              title="Choose Interview Type"
              description="Select from technical, behavioral, or role-specific interviews tailored to your needs."
            />
            <StepCard
              number="3"
              title="Practice & Improve"
              description="Answer AI-generated questions, get instant feedback, and track your progress over time."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of candidates who improved their interview skills with InterviewlyAI.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-background px-10 py-4 text-base md:text-lg font-semibold text-primary hover:bg-background/90 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t bg-secondary/20">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 InterviewlyAI. All rights reserved.
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10 from-primary/20 to-primary/5" />
      <div className="relative flex flex-col p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
        <div className={`inline-flex w-fit p-3 rounded-xl bg-gradient-to-br ${gradient} mb-5 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div className="flex-shrink-0 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-3xl md:text-4xl shadow-xl shadow-primary/25">
        {number}
      </div>
      <div className="flex-1 space-y-3">
        <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}