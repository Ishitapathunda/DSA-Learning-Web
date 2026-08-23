import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { listUserBadges } from "../services/badges.service";

export const getBadges = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const badges = await listUserBadges(req.userId);
  res.status(200).json({ badges });
});
