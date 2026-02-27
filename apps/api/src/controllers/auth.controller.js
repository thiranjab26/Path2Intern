import jwt from "jsonwebtoken";
import {
  registerStudent,
  verifyEmail,
  resendVerificationCode,
  loginUser,
} from "../services/auth.service.js";
import { User } from "../models/user.model.js";
import { ModuleScopedRole } from "../models/moduleScopedRole.model.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // 'strict' blocks cross-origin localhost requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Registering user:", { name, email }); // Debug log
    const { user } = await registerStudent({ name, email, password });

    res.status(201).json({
      message: "Registered successfully. Please check your email for your verification code.",
      user: { id: user._id, name: user.name, email: user.email, globalRole: user.globalRole },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await verifyEmail({ email, code });

    res.json({
      message: "Email verified successfully",
      user: { id: user._id, name: user.name, email: user.email, globalRole: user.globalRole },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const resend = async (req, res) => {
  try {
    const { email } = req.body;
    await resendVerificationCode({ email });

    res.json({ message: "Verification code resent. Please check your email." });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.cookie("authToken", token, COOKIE_OPTIONS);

    // Fetch module-scoped roles
    const moduleScopedRoles = await ModuleScopedRole.find({ userId: user._id }).select("module role -_id");

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        globalRole: user.globalRole,
        moduleScopedRoles,
      },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// Session restoration — reads the authToken cookie and returns the current user
export const me = async (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-passwordHash -emailVerificationCodeHash -emailVerificationExpiresAt");
    if (!user) return res.status(401).json({ message: "User not found" });

    // Fetch module-scoped roles
    const moduleScopedRoles = await ModuleScopedRole.find({ userId: user._id }).select("module role -_id");

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        globalRole: user.globalRole,
        moduleScopedRoles,
      },
    });
  } catch {
    res.status(401).json({ message: "Invalid or expired session" });
  }
};