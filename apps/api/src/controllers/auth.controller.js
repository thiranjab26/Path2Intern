import {
  registerStudent,
  verifyEmail,
  resendVerificationCode,
  loginUser,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { user, code } = await registerStudent({ name, email, password });

    // For now: return code for testing.
    // Later: email it and remove it from response.
    res.status(201).json({
      message: "Registered successfully. Please verify your email.",
      verificationCode: code,
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

    const { code } = await resendVerificationCode({ email });

    res.json({
      message: "Verification code resent",
      verificationCode: code, // remove later in production
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginUser({ email, password });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, globalRole: user.globalRole },
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};