import { prisma } from "../utils/prisma";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  solvedCount: number;
  currentStreak: number;
}

// Loads every user with their solved-progress count and current streak,
// then sorts in memory. Simple and easy to reason about at the scale of a
// learning platform's user base; at real production scale this would be
// better expressed as a single SQL aggregation (e.g. Prisma groupBy on
// Progress joined to User) rather than pulling every row into Node.
export const getLeaderboard = async (limit = 50): Promise<LeaderboardEntry[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      streak: { select: { currentStreak: true } },
      progress: { where: { solved: true }, select: { id: true } },
    },
  });

  return users
    .map((u: { id: string; username: string; streak: { currentStreak: number } | null; progress: { id: string }[] }) => ({
      userId: u.id,
      username: u.username,
      solvedCount: u.progress.length,
      currentStreak: u.streak?.currentStreak ?? 0,
    }))
    .sort((a: { solvedCount: number; currentStreak: number }, b: { solvedCount: number; currentStreak: number }) =>
      b.solvedCount - a.solvedCount || b.currentStreak - a.currentStreak
    )
    .slice(0, limit)
    .map((entry: { userId: string; username: string; solvedCount: number; currentStreak: number }, index: number) => ({
      rank: index + 1,
      ...entry,
    }));
};
