import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

// Catches every error forwarded via next(err) (including from asyncHandler)
// and returns a consistent { error: { message, details? } } JSON shape.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation failed",
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
  }

  // Prisma unique constraint violation, etc. — keep the message generic
  // for unexpected errors so we never leak internals to the client.
  console.error("Unhandled error:", err);
  return res.status(500).json({
    error: { message: "Something went wrong on the server." },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
};
