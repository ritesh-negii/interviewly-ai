import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserIdFromRequest } from "@/lib/auth";
import InterviewSession from "@/models/InterviewSession";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    
    const sessions = await InterviewSession.find({ userId }).sort({ createdAt: -1 });

   
    const totalInterviews = sessions.length;
    const completedSessions = sessions.filter(s => s.status === "completed");
    const completedInterviews = completedSessions.length;
    
 
    const totalScore = completedSessions.reduce((sum, s) => sum + (s.overallScore || 0), 0);
    const averageScore = completedInterviews > 0 ? Math.round(totalScore / completedInterviews) : 0;

    
    const totalMinutes = Math.round(
      sessions.reduce((sum, s) => sum + (s.totalTimeSpent || 0), 0) / 60
    );

  
    const recentInterviews = sessions.slice(0, 5).map(s => ({
      id: s._id,
      type: s.type,
      role: "Software Engineer", 
      score: s.overallScore || 0,
      date: s.createdAt,
      duration: Math.round((s.totalTimeSpent || 0) / 60),
      completed: s.status === "completed"
    }));

    return NextResponse.json({
      stats: {
        totalInterviews,
        completedInterviews,
        averageScore,
        improvementRate: 0, 
        practiceStreak: 0, 
        totalMinutes
      },
      recentInterviews
    });

  } catch (error: any) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}