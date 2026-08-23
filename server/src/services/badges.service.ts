import { prisma } from "../utils/prisma";

// Keys must match the Badge rows seeded in prisma/seed.ts.
const SOLVE_MILESTONES: { key: string; threshold: number }[] = [
  { key: "FIRST_PROBLEM", threshold: 1 },
  { key: "PROBLEM_SOLVER", threshold: 10 },
  { key: "DSA_EXPLORER", threshold: 25 },
  { key: "DSA_MASTER", threshold: 50 },
];

const STREAK_MILESTONES: { key: string; threshold: number }[] = [
  { key: "STREAK_3", threshold: 3 },
  { key: "STREAK_7", threshold: 7 },
];

const awardBadgeIfMissing = async (userId: string, key: string) => {
  const badge = await prisma.badge.findUnique({ where: { key } });
  if (!badge) return null; // badge catalog not seeded — nothing to award

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return null;

  return prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
};

// Called after every successful (PASSED) submission — checks solved-count
// and streak milestones and awards any newly-earned badges. Idempotent:
// already-earned badges are never re-awarded (unique constraint on
// [userId, badgeId] plus the existence check above).
export const checkAndAwardBadges = async (userId: string): Promise<string[]> => {
  const [solvedCount, streak] = await Promise.all([
    prisma.progress.count({ where: { userId, solved: true } }),
    prisma.userStreak.findUnique({ where: { userId } }),
  ]);

  const newlyAwarded: string[] = [];

  for (const milestone of SOLVE_MILESTONES) {
    if (solvedCount >= milestone.threshold) {
      const awarded = await awardBadgeIfMissing(userId, milestone.key);
      if (awarded) newlyAwarded.push(milestone.key);
    }
  }

  if (streak) {
    for (const milestone of STREAK_MILESTONES) {
      if (streak.currentStreak >= milestone.threshold) {
        const awarded = await awardBadgeIfMissing(userId, milestone.key);
        if (awarded) newlyAwarded.push(milestone.key);
      }
    }
  }

  return newlyAwarded;
};

export const listUserBadges = async (userId: string) => {
  const [allBadges, earned] = await Promise.all([
    prisma.badge.findMany({ orderBy: { name: "asc" } }),
    prisma.userBadge.findMany({ where: { userId } }),
  ]);

  const earnedMap = new Map(earned.map((e: { badgeId: string; earnedAt: Date }) => [e.badgeId, e.earnedAt]));

  return allBadges.map((b: { id: string; key: string; name: string; description: string; icon: string | null }) => ({
    key: b.key,
    name: b.name,
    description: b.description,
    icon: b.icon,
    earned: earnedMap.has(b.id),
    earnedAt: earnedMap.get(b.id) ?? null,
  }));
};
