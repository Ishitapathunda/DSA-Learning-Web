import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { verifyToken } from "../utils/jwt";

// Augment Express's Request type so `req.userId` is available and typed
// in every downstream handler after this middleware runs.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const COOKIE_NAME = process.env.COOKIE_NAME || "dsa_token";

// Reads the JWT from the httpOnly cookie (falls back to an Authorization
// header for non-browser clients like curl/Postman/tests), verifies it,
// and attaches the decoded userId to the request. Rejects with 401 otherwise.
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const cookieToken = req.cookies?.[COOKIE_NAME];
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;

  const token = cookieToken || headerToken;

  if (!token) {
    return next(new ApiError(401, "Not authenticated. Please log in."));
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return next(new ApiError(401, "Session expired or invalid. Please log in again."));
  }
};

// Optional-auth variant: attaches userId if a valid token is present,
// but never blocks the request. Useful for routes that behave
// differently for logged-in vs anonymous users without requiring login.
export const attachUserIfPresent = (req: Request, _res: Response, next: NextFunction) => {
  const cookieToken = req.cookies?.[COOKIE_NAME];
  if (cookieToken) {
    try {
      req.userId = verifyToken(cookieToken).userId;
    } catch {
      // Ignore invalid/expired tokens here — this middleware never rejects.
    }
  }
  next();
};
