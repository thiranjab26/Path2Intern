import {
  registerStudent,
  verifyEmail,
  resendVerificationCode,
  loginUser,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { user } = await registerStudent({ name, email, password });

    res.status(201).json({
      message: "Registered successfully. Please check your email for verification code.",
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

    const { user } = await resendVerificationCode({ email });

    res.json({
      message: "Verification code resent. Please check your email.",
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    // Set HTTP-only cookie with JWT token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, globalRole: user.globalRole },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};