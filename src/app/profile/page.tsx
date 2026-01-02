"use client";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, FileText, Upload, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020817] font-sans">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">
          My Profile
        </h1>

        {/* User Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm mb-6">
          
          {/* MOBILE FIX 1: Flex-col for mobile (stacked), Flex-row for desktop */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8 text-center md:text-left">
            
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {user?.name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-primary shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="overflow-hidden"> {/* Prevents email overflow */}
                <p className="text-xs text-slate-500 font-semibold uppercase">Email Address</p>
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          
          {/* MOBILE FIX 2: Allow wrapping so badge doesn't squish title */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume Settings
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs font-bold rounded-full">
              Active
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm md:text-base">
            Your resume is used to personalize interview questions. You can upload a new version to update your skills and experience.
          </p>

          <button 
            className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-primary hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            onClick={() => window.location.href = '/dashboard?action=upload'}
          >
            <Upload className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Upload New Resume</span>
            <span className="text-xs mt-1 text-center px-4">PDF formats only (Max 5MB)</span>
          </button>
        </div>
      </div>
    </div>
  );
}