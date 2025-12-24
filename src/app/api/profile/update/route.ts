// src/app/api/profile/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getUserIdFromRequest } from "@/lib/auth";

export async function PUT(request: NextRequest) {
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

    const { college, degree, year, targetRole, experience } = await request.json();

    // Validation
    if (!college || !degree || !year || !targetRole || !experience) {
      return NextResponse.json(
        { success: false, message: "All profile fields are required" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profile: { college, degree, year, targetRole, experience },
        profileCompleted: true,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profileCompleted: updatedUser.profileCompleted,
          profile: updatedUser.profile,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}