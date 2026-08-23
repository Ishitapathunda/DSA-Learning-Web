import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { getUserAnalytics } from "../services/analytics.service";

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const analytics = await getUserAnalytics(req.userId);
  res.status(200).json({ analytics });
});
