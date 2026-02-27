import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import moduleRoutes from "./routes/module.routes.js";

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Path2Intern API running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/module", moduleRoutes);

export default app;