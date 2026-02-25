import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

console.log("Environment variables loaded:");
console.log("PORT:", process.env.PORT);
console.log("MAILTRAP_HOST:", process.env.MAILTRAP_HOST);
console.log("MAILTRAP_PORT:", process.env.MAILTRAP_PORT);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();