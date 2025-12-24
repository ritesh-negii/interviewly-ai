// src/app/api/resume/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import Resume from "@/models/Resume";
import { getUserIdFromRequest } from "@/lib/auth";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import { PDFExtract } from "pdf.js-extract";

const pdfExtract = new PDFExtract();

export async function POST(request: NextRequest) {
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("📄 Extracting text from PDF...");

    // Extract text from PDF
    const data = await pdfExtract.extractBuffer(buffer, {
      normalizeWhitespace: true,
      combineTextItems: true,
    });

    let text = "";
    data.pages.forEach((page: any) => {
      page.content.forEach((item: any) => {
        text += item.str + " ";
      });
    });

    console.log("✅ Extracted text length:", text.length);

    if (!text.trim()) {
      return NextResponse.json(
        { success: false, message: "Unable to extract readable text from PDF" },
        { status: 400 }
      );
    }

    console.log("🤖 Analyzing resume with Gemini AI...");
    const aiData = await analyzeResumeWithGemini(text);

    // Get user profile
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Merge profile data if AI didn't extract valid education
    const hasValidEducation = aiData.education?.some((edu) => {
      const lower = edu.institution?.toLowerCase() || "";
      return lower && !["abc", "xyz", "example"].some((p) => lower.includes(p));
    });

    if (!hasValidEducation && user.profile?.college) {
      aiData.education = [
        {
          degree: user.profile.degree || "Pursuing Degree",
          institution: user.profile.college,
          year: user.profile.year || "Not specified",
        },
      ];
    }

    if (!aiData.targetRole && user.profile?.targetRole) {
      aiData.targetRole = user.profile.targetRole;
    }
    if (!aiData.experienceLevel && user.profile?.experience) {
      aiData.experienceLevel = user.profile.experience;
    }

    // Upsert resume (update existing or create new)
    const resume = await Resume.findOneAndUpdate(
      { userId },
      {
        originalText: text.trim(),
        parsedData: aiData,
        status: "pending",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // Update user's resumeUploaded status
    user.resumeUploaded = true;
    await user.save();

    console.log("✅ Resume saved/updated successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Resume analyzed successfully",
        resumeId: resume._id,
        data: aiData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Resume upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Resume analysis failed" },
      { status: 500 }
    );
  }
}

// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};