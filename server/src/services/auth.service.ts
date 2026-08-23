import bcrypt from "bcryptjs";
import { prisma } from "../utils/prisma";
import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/jwt";
import { LoginInput, RegisterInput } from "../utils/validation";

const SALT_ROUNDS = 12;

// The shape of a user we're safe to send back to the client —
// passwordHash is deliberately excluded.
export const toPublicUser = (user: { id: string; username: string; email: string; createdAt: Date }) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });

  if (existing) {
    const field = existing.email === input.email ? "Email" : "Username";
    throw new ApiError(409, `${field} is already in use.`);
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      passwordHash,
      streak: { create: {} }, // every user starts with a zeroed streak row
    },
  });

  const token = signToken({ userId: user.id });
  return { user: toPublicUser(user), token };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Deliberately vague error message — don't reveal whether the email exists.
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = signToken({ userId: user.id });
  return { user: toPublicUser(user), token };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }
  return toPublicUser(user);
};
