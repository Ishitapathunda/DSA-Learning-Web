import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getLeaderboard } from "../services/leaderboard.service";

export const getLeaderboardHandler = asyncHandler(async (_req: Request, res: Response) => {
  const leaderboard = await getLeaderboard();
  res.status(200).json({ leaderboard });
});
