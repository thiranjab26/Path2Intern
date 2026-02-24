import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// STUDENT: @my.sliit.lk
// STAFF:   @sliit.lk
const validateEmailByRole = (email, role) => {
  const e = email.toLowerCase();

  if (role === "STUDENT" && !e.endsWith("@my.sliit.lk")) {
    throw new Error("Student email must end with @my.sliit.lk");
  }
  if (role === "STAFF" && !e.endsWith("@sliit.lk")) {
    throw new Error("Staff email must end with @sliit.lk");
  }
};

const generate6DigitCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const registerStudent = async ({ name, email, password }) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error("Email already registered");

  // public registration is only STUDENT
  validateEmailByRole(email, "STUDENT");

  const passwordHash = await bcrypt.hash(password, 10);

  // OTP generation + hash storage
  const code = generate6DigitCode();
  const emailVerificationCodeHash = await bcrypt.hash(code, 10);
  const emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    name,
    email,
    passwordHash,
    globalRole: "STUDENT",
    isEmailVerified: false,
    emailVerificationCodeHash,
    emailVerificationExpiresAt,
  });

  // return code so you can send via email (later)
  // IMPORTANT: in production, do NOT return the code in API response.
  return { user, code };
};

export const verifyEmail = async ({ email, code }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  if (user.isEmailVerified) {
    return user; // already verified
  }

  if (!user.emailVerificationCodeHash || !user.emailVerificationExpiresAt) {
    throw new Error("No verification code found. Please request a new one.");
  }

  if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
    throw new Error("Verification code expired. Please request a new one.");
  }

  const ok = await bcrypt.compare(code, user.emailVerificationCodeHash);
  if (!ok) throw new Error("Invalid verification code");

  user.isEmailVerified = true;
  user.emailVerificationCodeHash = null;
  user.emailVerificationExpiresAt = null;
  await user.save();

  return user;
};

export const resendVerificationCode = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  if (user.isEmailVerified) throw new Error("Email is already verified");

  // re-validate domain based on existing role
  validateEmailByRole(user.email, user.globalRole);

  const code = generate6DigitCode();
  user.emailVerificationCodeHash = await bcrypt.hash(code, 10);
  user.emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  return { user, code };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Email not verified");
  }

  const token = jwt.sign(
    { userId: user._id.toString(), globalRole: user.globalRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};