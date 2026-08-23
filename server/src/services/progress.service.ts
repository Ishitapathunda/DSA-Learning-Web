import { prisma } from "../utils/prisma";

// Called after every SUBMIT (not RUN) attempt, pass or fail, so `attempts`
// reflects real submission history. Marks the problem solved (and stamps
// solvedAt) the first time the user passes it — later re-submits of an
// already-solved problem still increment attempts but don't move solvedAt.
export const recordAttempt = async (userId: string, problemId: string, passed: boolean) => {
  const existing = await prisma.progress.findUnique({
    where: { userId_problemId: { userId, problemId } },
  });

  if (!existing) {
    return prisma.progress.create({
      data: {
        userId,
        problemId,
        attempts: 1,
        solved: passed,
        solvedAt: passed ? new Date() : null,
      },
    });
  }

  return prisma.progress.update({
    where: { userId_problemId: { userId, problemId } },
    data: {
      attempts: existing.attempts + 1,
      solved: existing.solved || passed,
      solvedAt: existing.solved ? existing.solvedAt : passed ? new Date() : null,
    },
  });
};

export interface TopicProgress {
  topic: string;
  solved: number;
  total: number;
}

export interface UserProgressSummary {
  totalProblems: number;
  solvedCount: number;
  remaining: number;
  topicBreakdown: TopicProgress[];
  difficultyBreakdown: { difficulty: string; solved: number; total: number }[];
}

export const getUserProgress = async (userId: string): Promise<UserProgressSummary> => {
  const [allProblems, solvedRows] = await Promise.all([
    prisma.problem.findMany({ select: { id: true, topic: true, difficulty: true } }),
    prisma.progress.findMany({
      where: { userId, solved: true },
      select: { problemId: true },
    }),
  ]);

  const solvedIds = new Set(solvedRows.map((r: { problemId: string }) => r.problemId));

  const topicMap = new Map<string, { solved: number; total: number }>();
  const difficultyMap = new Map<string, { solved: number; total: number }>();

  for (const p of allProblems) {
    const t = topicMap.get(p.topic) || { solved: 0, total: 0 };
    t.total += 1;
    if (solvedIds.has(p.id)) t.solved += 1;
    topicMap.set(p.topic, t);

    const d = difficultyMap.get(p.difficulty) || { solved: 0, total: 0 };
    d.total += 1;
    if (solvedIds.has(p.id)) d.solved += 1;
    difficultyMap.set(p.difficulty, d);
  }

  return {
    totalProblems: allProblems.length,
    solvedCount: solvedIds.size,
    remaining: allProblems.length - solvedIds.size,
    topicBreakdown: Array.from(topicMap.entries()).map(([topic, v]) => ({ topic, ...v })),
    difficultyBreakdown: Array.from(difficultyMap.entries()).map(([difficulty, v]) => ({ difficulty, ...v })),
  };
};
