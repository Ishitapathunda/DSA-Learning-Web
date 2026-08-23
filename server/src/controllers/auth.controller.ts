import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { loginSchema, registerSchema } from "../utils/validation";
import { getUserById, loginUser, registerUser } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

const COOKIE_NAME = process.env.COOKIE_NAME || "dsa_token";
const isProduction = process.env.NODE_ENV === "production";

// Seven days, in milliseconds — matches the default JWT_EXPIRES_IN.
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // not readable by client-side JS — mitigates XSS token theft
    secure: isProduction, // HTTPS-only in production
    sameSite: isProduction ? "none" : "lax", // "lax" works for same-site dev via the Vite proxy
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const { user, token } = await registerUser(input);
  setAuthCookie(res, token);
  res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const { user, token } = await loginUser(input);
  setAuthCookie(res, token);
  res.status(200).json({ user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.status(200).json({ message: "Logged out." });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new ApiError(401, "Not authenticated.");
  }
  const user = await getUserById(req.userId);
  res.status(200).json({ user });
});
