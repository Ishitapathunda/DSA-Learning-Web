import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import problemsRoutes from "./routes/problems.routes";
import submissionsRoutes from "./routes/submissions.routes";
import progressRoutes from "./routes/progress.routes";
import badgesRoutes from "./routes/badges.routes";
import streakRoutes from "./routes/streak.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true, // allow the httpOnly auth cookie to be sent/received
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/problems", problemsRoutes);
  app.use("/api/submissions", submissionsRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/badges", badgesRoutes);
  app.use("/api/streak", streakRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/analytics", analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
