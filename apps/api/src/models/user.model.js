import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: { type: String, required: true },

    globalRole: {
      type: String,
      required: true,
      enum: ["SYSTEM_ADMIN", "UNIVERSITY_ADMIN", "RECRUITER", "STUDENT"],
      default: "STUDENT",
    },

    isEmailVerified: { type: Boolean, default: false },

    // Email verification (OTP/code)
    emailVerificationCodeHash: { type: String, default: null },
    emailVerificationExpiresAt: { type: Date, default: null },

    // optional relations
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University", default: null },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);