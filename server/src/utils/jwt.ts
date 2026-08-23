import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail loudly at request-time rather than silently signing with "undefined".
    throw new Error("JWT_SECRET is not set. Check your server/.env file.");
  }
  return secret;
};

export const signToken = (payload: JwtPayload): string => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, getSecret(), { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};
