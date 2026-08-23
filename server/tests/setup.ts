import { beforeEach, afterAll } from "vitest";
import { prisma } from "../src/utils/prisma";

// Runs before every test in every file. Clears only user-generated data
// (submissions, progress, badges earned, streaks, users themselves) so
// each test starts from a clean slate — the seeded Problem/Badge catalog
// is left alone since re-seeding per test would be slow and unnecessary.
beforeEach(async () => {
  await prisma.submission.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userStreak.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
