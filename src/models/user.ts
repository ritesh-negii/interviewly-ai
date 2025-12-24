// src/models/User.ts
import mongoose, { Schema, Model } from "mongoose";

export interface IUserProfile {
  college?: string;
  degree?: string;
  year?: string;
  targetRole?: string;
  experience?: string;
}


export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  profile: IUserProfile;
  profileCompleted: boolean;
  resumeUploaded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    profile: {
      college: { type: String, default: "" },
      degree: { type: String, default: "" },
      year: { type: String, default: "" },
      targetRole: { type: String, default: "" },
      experience: { type: String, default: "" },
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    resumeUploaded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;