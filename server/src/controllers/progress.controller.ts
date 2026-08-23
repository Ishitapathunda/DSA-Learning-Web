import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { getUserProgress } from "../services/progress.service";

export const getProgress = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const progress = await getUserProgress(req.userId);
  res.status(200).json({ progress });
});
