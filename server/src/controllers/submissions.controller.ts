import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { runCode, submitCode, listUserSubmissions } from "../services/submissions.service";

const runOrSubmitSchema = z.object({
  slug: z.string().min(1, "slug is required"),
  code: z.string().min(1, "code is required"),
});

export const postRun = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const { slug, code } = runOrSubmitSchema.parse(req.body);
  const result = await runCode(req.userId, slug, code);
  res.status(200).json({ result });
});

export const postSubmit = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const { slug, code } = runOrSubmitSchema.parse(req.body);
  const result = await submitCode(req.userId, slug, code);
  res.status(200).json({ result });
});

export const getSubmissions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) throw new ApiError(401, "Not authenticated.");
  const slug = typeof req.query.slug === "string" ? req.query.slug : undefined;
  const submissions = await listUserSubmissions(req.userId, slug);
  res.status(200).json({ submissions });
});
