import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { getStreak } from "../services/streak.service";

export const getStreakHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const streak = await getStreak(req.userId);
  res.status(200).json({ streak });
});
