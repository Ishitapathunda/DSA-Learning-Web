import { prisma } from "../utils/prisma";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const isYesterday = (date: Date, today: Date) => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
};

// Called once per successful (PASSED) submission. Solving multiple
// problems (or re-submitting the same one) on the same calendar day is a
// no-op the second time — the streak only advances once per day.
export const recordSolveForStreak = async (userId: string) => {
  const today = new Date();

  const streak = await prisma.userStreak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  if (streak.lastSolvedDate && isSameDay(streak.lastSolvedDate, today)) {
    return streak; // already counted today — duplicate submission, no change
  }

  const continuesStreak = streak.lastSolvedDate ? isYesterday(streak.lastSolvedDate, today) : false;
  const newCurrent = continuesStreak ? streak.currentStreak + 1 : 1;
  const newLongest = Math.max(streak.longestStreak, newCurrent);

  return prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastSolvedDate: today,
    },
  });
};

export const getStreak = async (userId: string) => {
  const streak = await prisma.userStreak.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastSolvedDate: streak.lastSolvedDate,
  };
};
