import { prisma } from "../utils/prisma";
import { getUserProgress } from "./progress.service";

export const getUserAnalytics = async (userId: string) => {
  const [progress, totalSubmits, passedSubmits] = await Promise.all([
    getUserProgress(userId),
    prisma.submission.count({ where: { userId, mode: "SUBMIT" } }),
    prisma.submission.count({ where: { userId, mode: "SUBMIT", status: "PASSED" } }),
  ]);

  const accuracy = totalSubmits > 0 ? Math.round((passedSubmits / totalSubmits) * 100) : 0;

  return {
    ...progress,
    totalSubmissions: totalSubmits,
    accuracy,
  };
};
