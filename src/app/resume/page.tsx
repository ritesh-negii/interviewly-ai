"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Upload, FileText, CheckCircle, Loader2, ArrowRight, X, Sparkles, Shield, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function ResumeUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selected);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      toast.success("Resume uploaded! Unlocking personalized questions...");
      router.push("/dashboard");
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-2xl space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-2">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Upload Your Resume</h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                We'll analyze your resume to generate personalized interview questions matching your skills and experience.
              </p>
            </div>

            {/* Benefits Cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border-2 border-border text-center">
                <div className="inline-flex p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30 text-blue-600 mb-2">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">Personalized Questions</p>
                <p className="text-xs text-muted-foreground mt-1">Tailored to your background</p>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-border text-center">
                <div className="inline-flex p-2 rounded-lg bg-green-100 dark:bg-green-950/30 text-green-600 mb-2">
                  <Zap className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">Instant Analysis</p>
                <p className="text-xs text-muted-foreground mt-1">AI-powered insights</p>
              </div>
              <div className="p-4 rounded-xl bg-card border-2 border-border text-center">
                <div className="inline-flex p-2 rounded-lg bg-purple-100 dark:bg-purple-950/30 text-purple-600 mb-2">
                  <Shield className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">Secure & Private</p>
                <p className="text-xs text-muted-foreground mt-1">Your data is protected</p>
              </div>
            </div>

            {/* Upload Box */}
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
                dragActive 
                  ? "border-primary bg-primary/5 scale-[1.02]" 
                  : file 
                    ? "border-green-500 bg-green-50/50 dark:bg-green-950/20"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {file ? (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="h-20 w-20 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <p className="font-bold text-xl text-foreground mb-1">{file.name}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                  </p>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation();
                      setFile(null); 
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors z-20 relative"
                  >
                    <X className="h-4 w-4" />
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="h-20 w-20 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Upload className="h-10 w-10" />
                  </div>
                  <p className="font-bold text-xl text-foreground mb-2">
                    {dragActive ? "Drop your file here" : "Upload your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop or click to browse
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border mt-4">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">PDF only • Max 5MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="group w-full py-4 sm:py-5 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Analyzing Resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Analyze Resume</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors hover:bg-secondary/50 rounded-lg"
              >
                Skip for now (I'll do generic interviews)
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                <Shield className="h-3 w-3 inline mr-1" />
                Your resume is encrypted and only used to generate personalized questions
              </p>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}