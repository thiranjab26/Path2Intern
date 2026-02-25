import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { sendVerificationEmail } from "./email.service.js";

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

const validatePassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new Error("Password must contain at least one number");
  }
};

export const registerStudent = async ({ name, email, password }) => {
  console.log("Starting registration for:", email);
  
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("Email already registered:", email);
    throw new Error("Email already registered");
  }

  // public registration is only STUDENT
  validateEmailByRole(email, "STUDENT");
  
  // validate password strength
  validatePassword(password);

  console.log("Creating password hash...");
  const passwordHash = await bcrypt.hash(password, 10);

  // OTP generation + hash storage
  const code = generate6DigitCode();
  console.log("Generated verification code:", code);
  const emailVerificationCodeHash = await bcrypt.hash(code, 10);
  const emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  console.log("Creating user in database...");
  const user = await User.create({
    name,
    email,
    passwordHash,
    globalRole: "STUDENT",
    isEmailVerified: false,
    emailVerificationCodeHash,
    emailVerificationExpiresAt,
  });

  console.log("User created successfully with ID:", user._id);

  // Send verification email
  try {
    console.log("Sending verification email...");
    await sendVerificationEmail(email, code);
    console.log("Email sent successfully");
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
    // If email fails, we should probably delete the user so they can try again
    await User.findByIdAndDelete(user._id);
    throw new Error("Failed to send verification email. Please try again.");
  }

  return { user };
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

  // Send verification email
  try {
    await sendVerificationEmail(user.email, code);
  } catch (emailError) {
    console.error("Failed to send verification email:", emailError);
    throw new Error("Failed to send verification email");
  }

  return { user };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("No account found with this email. Please register first.");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  if (!user.isEmailVerified) {
    throw new Error("Email not verified. Please check your email for the verification code.");
  }

  const token = jwt.sign(
    { userId: user._id.toString(), globalRole: user.globalRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};