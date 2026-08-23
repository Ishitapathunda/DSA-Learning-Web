import { prisma } from "../utils/prisma";
import { ApiError } from "../utils/ApiError";

// Problem rows store examples/constraints/starterCode/testCases as JSON
// strings (SQLite has no native JSON column in Prisma). This parses the
// displayable fields back into real objects/arrays for the response, and
// deliberately OMITS testCases — those are hidden judge data used only
// server-side by the execution service, never sent to the client.
const parseProblem = (problem: {
  examples: string;
  constraints: string;
  starterCode: string | null;
  testCases: string | null;
  [key: string]: unknown;
}) => {
  const { testCases, ...rest } = problem;
  return {
    ...rest,
    examples: JSON.parse(problem.examples),
    constraints: JSON.parse(problem.constraints),
    starterCode: problem.starterCode ? JSON.parse(problem.starterCode) : null,
    hasExecution: Boolean(testCases),
  };
};

// Lightweight fields for the list view — omits examples/constraints/starterCode
// to keep the /api/problems payload small; the detail endpoint returns everything.
const listSelect = {
  id: true,
  slug: true,
  title: true,
  topic: true,
  difficulty: true,
  description: true,
} as const;

export interface ListProblemsFilters {
  topic?: string;
  difficulty?: string;
  search?: string;
}

export const listProblems = async (filters: ListProblemsFilters) => {
  const where: Record<string, unknown> = {};

  if (filters.topic && filters.topic !== "All") {
    where.topic = filters.topic;
  }
  if (filters.difficulty && filters.difficulty !== "All") {
    where.difficulty = filters.difficulty;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  return prisma.problem.findMany({
    where,
    select: listSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const getProblemBySlug = async (slug: string) => {
  const problem = await prisma.problem.findUnique({ where: { slug } });
  if (!problem) {
    throw new ApiError(404, "Problem not found.");
  }
  return parseProblem(problem);
};

// Internal use only (execution/submission service) — includes the hidden
// judge test cases. Never expose the raw return value of this function
// directly in an HTTP response.
export const getProblemForExecution = async (slug: string) => {
  const problem = await prisma.problem.findUnique({ where: { slug } });
  if (!problem) {
    throw new ApiError(404, "Problem not found.");
  }
  if (!problem.testCases) {
    throw new ApiError(400, "This problem doesn't support code execution yet.");
  }
  return {
    id: problem.id,
    slug: problem.slug,
    starterCode: problem.starterCode ? JSON.parse(problem.starterCode) : null,
    examples: JSON.parse(problem.examples) as { input: string; output: string }[],
    testCases: JSON.parse(problem.testCases) as { input: string; expectedOutput: string }[],
  };
};

export const listTopics = async () => {
  const rows = await prisma.problem.findMany({
    select: { topic: true },
    distinct: ["topic"],
    orderBy: { topic: "asc" },
  });
  return rows.map((r: { topic: string }) => r.topic);
};
