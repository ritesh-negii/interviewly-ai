
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

  
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      profile: {
        college: "",
        degree: "",
        year: "",
        targetRole: "",
        experience: "",
      },
      profileCompleted: false,
      resumeUploaded: false,
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Signup successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileCompleted: user.profileCompleted,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}