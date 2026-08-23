import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getProblemBySlug, listProblems, listTopics } from "../services/problems.service";

export const getProblems = asyncHandler(async (req: Request, res: Response) => {
  const { topic, difficulty, search } = req.query;
  const problems = await listProblems({
    topic: typeof topic === "string" ? topic : undefined,
    difficulty: typeof difficulty === "string" ? difficulty : undefined,
    search: typeof search === "string" ? search : undefined,
  });
  res.status(200).json({ problems, count: problems.length });
});

export const getProblem = asyncHandler(async (req: Request, res: Response) => {
  const problem = await getProblemBySlug(req.params.slug);
  res.status(200).json({ problem });
});

export const getTopics = asyncHandler(async (_req: Request, res: Response) => {
  const topics = await listTopics();
  res.status(200).json({ topics });
});
