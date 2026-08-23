import request from "supertest";
import { createApp } from "../src/app";

export const app = createApp();

let userCounter = 0;

// Registers a fresh, unique user and returns the httpOnly auth cookie so
// callers can immediately make authenticated requests.
export const registerAndLogin = async (overrides: Partial<{ username: string; email: string; password: string }> = {}) => {
  userCounter += 1;
  const payload = {
    username: overrides.username ?? `testuser${userCounter}`,
    email: overrides.email ?? `testuser${userCounter}@example.com`,
    password: overrides.password ?? "password123",
  };

  const res = await request(app).post("/api/auth/register").send(payload);
  const cookie = res.headers["set-cookie"];
  return { cookie, payload, res };
};
