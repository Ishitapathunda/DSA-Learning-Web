import { prisma } from "../utils/prisma";
import { getProblemForExecution } from "./problems.service";
import { judgeSubmission, JudgeResult } from "../execution/judge";
import { recordAttempt } from "./progress.service";
import { recordSolveForStreak } from "./streak.service";
import { checkAndAwardBadges } from "./badges.service";
import { ApiError } from "../utils/ApiError";

// "Run" only checks the problem's public examples — fast feedback while
// iterating, doesn't touch progress/streaks, and doesn't use up the full
// hidden test suite.
export const runCode = async (userId: string, slug: string, code: string) => {
  const problem = await getProblemForExecution(slug);

  // The judge needs {input, expectedOutput}; examples only have
  // {input, output}, so adapt the shape for a "Run" pass.
  const sampleCases = problem.testCases.slice(0, 2).map((tc) => ({
    input: tc.input,
    expectedOutput: tc.expectedOutput,
  }));

  const result = await judgeSubmission(code, sampleCases);

  await prisma.submission.create({
    data: {
      userId,
      problemId: problem.id,
      code,
      language: "cpp",
      mode: "RUN",
      status: result.overallStatus,
      output: JSON.stringify(result.compileError ? { compileError: result.compileError } : result.results),
    },
  });

  return result;
};

// "Submit" runs the FULL hidden test suite and, if every case passes,
// updates the user's progress (Phase 5). This is the only path that
// affects solved-count / topic progress / (later) streaks and badges.
export const submitCode = async (userId: string, slug: string, code: string) => {
  const problem = await getProblemForExecution(slug);

  const result: JudgeResult = await judgeSubmission(code, problem.testCases);

  await prisma.submission.create({
    data: {
      userId,
      problemId: problem.id,
      code,
      language: "cpp",
      mode: "SUBMIT",
      status: result.overallStatus,
      output: JSON.stringify(result.compileError ? { compileError: result.compileError } : result.results),
    },
  });

  // A compile/runtime ERROR is not a graded attempt against the test
  // suite — don't count it toward attempts or affect solved state.
  let newlyAwardedBadges: string[] = [];
  if (result.overallStatus !== "ERROR") {
    await recordAttempt(userId, problem.id, result.overallStatus === "PASSED");

    if (result.overallStatus === "PASSED") {
      // Order matters: streak must be updated before badge milestones are
      // checked, since a STREAK_3/STREAK_7 badge depends on today's streak.
      await recordSolveForStreak(userId);
      newlyAwardedBadges = await checkAndAwardBadges(userId);
    }
  }

  return { ...result, newlyAwardedBadges };
};

export const listUserSubmissions = async (userId: string, slug?: string) => {
  const where: Record<string, unknown> = { userId };
  if (slug) {
    const problem = await prisma.problem.findUnique({ where: { slug }, select: { id: true } });
    if (!problem) {
      throw new ApiError(404, "Problem not found.");
    }
    where.problemId = problem.id;
  }

  return prisma.submission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      mode: true,
      status: true,
      language: true,
      createdAt: true,
      problem: { select: { slug: true, title: true, difficulty: true } },
    },
  });
};
