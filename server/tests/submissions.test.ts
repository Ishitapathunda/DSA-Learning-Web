import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { app, registerAndLogin } from "./helpers";

// The judge module is the boundary to Docker — mocking it here lets us
// test all the business logic (progress/streak/badge side effects)
// without requiring Docker to be installed in the test environment.
// Docker sandbox behavior itself (dockerRunner.ts) is verified manually
// per the Phase 4 setup instructions, since it's an infrastructure
// dependency rather than something a unit test should spin up.
vi.mock("../src/execution/judge", () => ({
  judgeSubmission: vi.fn(),
}));

import { judgeSubmission } from "../src/execution/judge";

const mockJudge = vi.mocked(judgeSubmission);

describe("Submissions", () => {
  beforeEach(() => {
    mockJudge.mockReset();
  });

  it("rejects run without auth", async () => {
    const res = await request(app).post("/api/submissions/run").send({ slug: "two-sum", code: "// x" });
    expect(res.status).toBe(401);
  });

  it("rejects submit without auth", async () => {
    const res = await request(app).post("/api/submissions").send({ slug: "two-sum", code: "// x" });
    expect(res.status).toBe(401);
  });

  it("validates the request body", async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app).post("/api/submissions").set("Cookie", cookie).send({ slug: "two-sum" });
    expect(res.status).toBe(400);
  });

  it("rejects submitting to a problem without a judge harness", async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app).post("/api/submissions").set("Cookie", cookie).send({ slug: "3sum", code: "// x" });
    expect(res.status).toBe(400);
  });

  it("marks the problem solved, advances the streak, and awards First Steps on a passing submit", async () => {
    const { cookie } = await registerAndLogin();

    mockJudge.mockResolvedValue({
      overallStatus: "PASSED",
      results: [{ input: "4\n2 7 11 15\n9", expectedOutput: "0 1", actualOutput: "0 1", verdict: "PASSED" }],
    });

    const submitRes = await request(app)
      .post("/api/submissions")
      .set("Cookie", cookie)
      .send({ slug: "two-sum", code: "// solution" });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.result.overallStatus).toBe("PASSED");
    expect(submitRes.body.result.newlyAwardedBadges).toContain("FIRST_PROBLEM");

    const progressRes = await request(app).get("/api/progress").set("Cookie", cookie);
    expect(progressRes.body.progress.solvedCount).toBe(1);

    const streakRes = await request(app).get("/api/streak").set("Cookie", cookie);
    expect(streakRes.body.streak.currentStreak).toBe(1);

    const badgesRes = await request(app).get("/api/badges").set("Cookie", cookie);
    const firstSteps = badgesRes.body.badges.find((b: { key: string }) => b.key === "FIRST_PROBLEM");
    expect(firstSteps.earned).toBe(true);
  });

  it("does not mark progress solved and does not award badges on a failing submit", async () => {
    const { cookie } = await registerAndLogin();

    mockJudge.mockResolvedValue({
      overallStatus: "FAILED",
      results: [{ input: "x", expectedOutput: "y", actualOutput: "z", verdict: "FAILED" }],
    });

    await request(app).post("/api/submissions").set("Cookie", cookie).send({ slug: "two-sum", code: "// bad" });

    const progressRes = await request(app).get("/api/progress").set("Cookie", cookie);
    expect(progressRes.body.progress.solvedCount).toBe(0);

    const badgesRes = await request(app).get("/api/badges").set("Cookie", cookie);
    expect(badgesRes.body.badges.every((b: { earned: boolean }) => !b.earned)).toBe(true);
  });

  it("does not affect progress on a compile ERROR", async () => {
    const { cookie } = await registerAndLogin();

    mockJudge.mockResolvedValue({
      overallStatus: "ERROR",
      results: [],
      compileError: "error: expected ';' before '}' token",
    });

    const res = await request(app).post("/api/submissions").set("Cookie", cookie).send({ slug: "two-sum", code: "int main() {" });
    expect(res.status).toBe(200);
    expect(res.body.result.overallStatus).toBe("ERROR");

    const progressRes = await request(app).get("/api/progress").set("Cookie", cookie);
    expect(progressRes.body.progress.solvedCount).toBe(0);
  });

  it("increments attempts on repeated submits without double-counting solved", async () => {
    const { cookie } = await registerAndLogin();

    mockJudge.mockResolvedValueOnce({
      overallStatus: "FAILED",
      results: [{ input: "x", expectedOutput: "y", actualOutput: "z", verdict: "FAILED" }],
    });
    await request(app).post("/api/submissions").set("Cookie", cookie).send({ slug: "two-sum", code: "// attempt 1" });

    mockJudge.mockResolvedValueOnce({
      overallStatus: "PASSED",
      results: [{ input: "x", expectedOutput: "y", actualOutput: "y", verdict: "PASSED" }],
    });
    await request(app).post("/api/submissions").set("Cookie", cookie).send({ slug: "two-sum", code: "// attempt 2" });

    const progressRes = await request(app).get("/api/progress").set("Cookie", cookie);
    expect(progressRes.body.progress.solvedCount).toBe(1); // solved once, not twice
  });

  it("lists submission history for the authenticated user only", async () => {
    const { cookie: cookieA } = await registerAndLogin();
    const { cookie: cookieB } = await registerAndLogin();

    mockJudge.mockResolvedValue({
      overallStatus: "PASSED",
      results: [{ input: "x", expectedOutput: "y", actualOutput: "y", verdict: "PASSED" }],
    });
    await request(app).post("/api/submissions").set("Cookie", cookieA).send({ slug: "two-sum", code: "// a" });

    const listA = await request(app).get("/api/submissions").set("Cookie", cookieA);
    const listB = await request(app).get("/api/submissions").set("Cookie", cookieB);

    expect(listA.body.submissions.length).toBe(1);
    expect(listB.body.submissions.length).toBe(0);
  });
});
