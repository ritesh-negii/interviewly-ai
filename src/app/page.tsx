// src/app/page.tsx
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Brain, Zap, Target, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-medium">AI-Powered Interview Practice</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Master Your Interviews with{" "}
            <span className="text-primary">AI Coaching</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Practice technical, behavioral, and role-specific interviews with our
            AI interviewer. Get instant feedback and improve your skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Practicing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-base font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose InterviewlyAI?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="AI-Powered Questions"
              description="Get personalized interview questions based on your resume and target role."
            />
            <FeatureCard
              icon={<Target className="h-10 w-10 text-primary" />}
              title="Real-time Feedback"
              description="Receive instant evaluation and suggestions to improve your answers."
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Track Progress"
              description="Monitor your performance over time and identify areas for improvement."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="space-y-8">
            <Step
              number="1"
              title="Upload Your Resume"
              description="Upload your resume and let our AI analyze your skills and experience."
            />
            <Step
              number="2"
              title="Choose Interview Type"
              description="Select from technical, behavioral, or role-specific interviews."
            />
            <Step
              number="3"
              title="Practice & Improve"
              description="Answer questions, get instant feedback, and track your progress."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of candidates who improved their interview skills with
            InterviewlyAI.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-background px-8 py-3 text-base font-semibold text-primary hover:bg-background/90 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 InterviewlyAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
