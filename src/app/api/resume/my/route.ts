// src/app/api/resume/my/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Resume from "@/models/Resume";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user ID from token
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user's resume
    const resume = await Resume.findOne({
      userId,
      status: { $in: ["pending", "confirmed"] },
    });

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "No resume found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        resume,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Get resume error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const resume = await Resume.findOneAndDelete({ userId });

    if (!resume) {
      return NextResponse.json(
        { success: false, message: "No resume found to delete" },
        { status: 404 }
      );
    }

    // ✅ FIX #5: Static import instead of dynamic import
    await User.findByIdAndUpdate(userId, { resumeUploaded: false });

    return NextResponse.json(
      {
        success: true,
        message: "Resume deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Delete resume error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete resume" },
      { status: 500 }
    );
  }
}