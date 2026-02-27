import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import inviteRoutes from "./routes/invite.routes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Path2Intern API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/module", moduleRoutes);
app.use("/api/invite", inviteRoutes);

export default app;