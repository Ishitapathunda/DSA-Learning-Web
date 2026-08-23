import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "./helpers";

describe("Problems", () => {
  it("lists all 55 seeded problems", async () => {
    const res = await request(app).get("/api/problems");
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(55);
    expect(res.body.problems.length).toBe(55);
  });

  it("filters by difficulty", async () => {
    const res = await request(app).get("/api/problems?difficulty=Easy");
    expect(res.status).toBe(200);
    expect(res.body.problems.every((p: { difficulty: string }) => p.difficulty === "Easy")).toBe(true);
  });

  it("returns 404 for an unknown slug", async () => {
    const res = await request(app).get("/api/problems/this-does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns full detail for a known slug, without leaking hidden test cases", async () => {
    const res = await request(app).get("/api/problems/two-sum");
    expect(res.status).toBe(200);
    expect(res.body.problem.title).toBe("Two Sum");
    expect(res.body.problem.hasExecution).toBe(true);
    expect(res.body.problem.testCases).toBeUndefined();
  });

  it("marks problems without a judge harness as hasExecution: false", async () => {
    const res = await request(app).get("/api/problems/3sum");
    expect(res.status).toBe(200);
    expect(res.body.problem.hasExecution).toBe(false);
  });

  it("lists distinct topics", async () => {
    const res = await request(app).get("/api/problems/topics");
    expect(res.status).toBe(200);
    expect(res.body.topics).toContain("Arrays");
  });
});
