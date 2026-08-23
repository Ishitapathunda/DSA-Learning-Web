import { describe, it, expect } from "vitest";
import request from "supertest";
import { app, registerAndLogin } from "./helpers";

describe("Auth", () => {
  it("registers a new user and never returns the password hash", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "alice",
      email: "alice@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe("alice");
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects registration with an invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "bademail",
      email: "not-an-email",
      password: "password123",
    });
    expect(res.status).toBe(400);
  });

  it("rejects registration with a duplicate email", async () => {
    await registerAndLogin({ email: "dup@example.com", username: "dupuser1" });
    const res = await request(app).post("/api/auth/register").send({
      username: "dupuser2",
      email: "dup@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("rejects registration with a duplicate username", async () => {
    await registerAndLogin({ username: "sameuser", email: "first@example.com" });
    const res = await request(app).post("/api/auth/register").send({
      username: "sameuser",
      email: "second@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    const { payload } = await registerAndLogin();
    const res = await request(app).post("/api/auth/login").send({
      email: payload.email,
      password: payload.password,
    });
    expect(res.status).toBe(200);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects login with the wrong password", async () => {
    const { payload } = await registerAndLogin();
    const res = await request(app).post("/api/auth/login").send({
      email: payload.email,
      password: "wrong-password",
    });
    expect(res.status).toBe(401);
  });

  it("rejects login for a nonexistent email with the same generic message (no user enumeration)", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nobody@example.com",
      password: "password123",
    });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Invalid email or password.");
  });

  it("rejects /me without a session cookie", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("returns the current user for /me with a valid session cookie", async () => {
    const { cookie, payload } = await registerAndLogin();
    const res = await request(app).get("/api/auth/me").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe(payload.username);
  });

  it("clears the session on logout", async () => {
    const { cookie } = await registerAndLogin();
    const logoutRes = await request(app).post("/api/auth/logout").set("Cookie", cookie);
    expect(logoutRes.status).toBe(200);
  });
});
