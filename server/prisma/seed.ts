import { PrismaClient } from "@prisma/client";
import { problems } from "./seedData/problems";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${problems.length} problems...`);

  for (const p of problems) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        topic: p.topic,
        difficulty: p.difficulty,
        description: p.description,
        examples: JSON.stringify(p.examples),
        constraints: JSON.stringify(p.constraints),
        starterCode: JSON.stringify(p.starterCode),
        testCases: p.testCases ? JSON.stringify(p.testCases) : null,
        language: "cpp",
      },
      create: {
        slug: p.slug,
        title: p.title,
        topic: p.topic,
        difficulty: p.difficulty,
        description: p.description,
        examples: JSON.stringify(p.examples),
        constraints: JSON.stringify(p.constraints),
        starterCode: JSON.stringify(p.starterCode),
        testCases: p.testCases ? JSON.stringify(p.testCases) : null,
        language: "cpp",
      },
    });
  }

  const badgeDefs = [
    { key: "FIRST_PROBLEM", name: "First Steps", description: "Solve your first problem", icon: "🎯" },
    { key: "PROBLEM_SOLVER", name: "Problem Solver", description: "Solve 10 problems", icon: "💪" },
    { key: "DSA_EXPLORER", name: "DSA Explorer", description: "Solve 25 problems", icon: "🧭" },
    { key: "DSA_MASTER", name: "DSA Master", description: "Solve 50 problems", icon: "🏆" },
    { key: "STREAK_3", name: "On a Roll", description: "3-day solving streak", icon: "🔥" },
    { key: "STREAK_7", name: "Week Warrior", description: "7-day solving streak", icon: "⚡" },
  ];

  console.log(`Seeding ${badgeDefs.length} badge definitions...`);
  for (const b of badgeDefs) {
    await prisma.badge.upsert({ where: { key: b.key }, update: b, create: b });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
