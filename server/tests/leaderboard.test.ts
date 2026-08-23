import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import { app, registerAndLogin } from "./helpers";

vi.mock("../src/execution/judge", () => ({ judgeSubmission: vi.fn() }));
import { judgeSubmission } from "../src/execution/judge";

describe("Leaderboard", () => {
  it("is publicly viewable without auth", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leaderboard)).toBe(true);
  });

  it("ranks users by solved count, highest first", async () => {
    const { cookie: topCookie } = await registerAndLogin({ username: "topuser", email: "top@example.com" });
    await registerAndLogin({ username: "loweruser", email: "lower@example.com" });

    vi.mocked(judgeSubmission).mockResolvedValue({
      overallStatus: "PASSED",
      results: [{ input: "x", expectedOutput: "y", actualOutput: "y", verdict: "PASSED" }],
    });
    await request(app).post("/api/submissions").set("Cookie", topCookie).send({ slug: "two-sum", code: "// x" });

    const res = await request(app).get("/api/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.leaderboard[0].username).toBe("topuser");
    expect(res.body.leaderboard[0].solvedCount).toBe(1);
    expect(res.body.leaderboard[0].rank).toBe(1);
  });
});
