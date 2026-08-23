import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, registerAndLogin } from "./helpers";

describe("Authorization", () => {
  const protectedGetRoutes = ["/api/auth/me", "/api/progress", "/api/badges", "/api/streak", "/api/analytics", "/api/submissions"];

  for (const route of protectedGetRoutes) {
    it(`rejects GET ${route} without a session`, async () => {
      const res = await request(app).get(route);
      expect(res.status).toBe(401);
    });
  }

  it("rejects a tampered/invalid session cookie", async () => {
    const res = await request(app).get("/api/auth/me").set("Cookie", "dsa_token=not-a-real-jwt");
    expect(res.status).toBe(401);
  });

  it("allows access to public routes without a session", async () => {
    const problemsRes = await request(app).get("/api/problems");
    expect(problemsRes.status).toBe(200);

    const leaderboardRes = await request(app).get("/api/leaderboard");
    expect(leaderboardRes.status).toBe(200);
  });

  it("grants access to protected routes with a valid session", async () => {
    const { cookie } = await registerAndLogin();
    const res = await request(app).get("/api/progress").set("Cookie", cookie);
    expect(res.status).toBe(200);
  });
});
