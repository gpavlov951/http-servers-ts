import { eq } from "drizzle-orm";
import { API_CONFIG } from "../../config.js";
import { db } from "../../db/index.js";
import {
  refreshTokens,
  users,
  type NewRefreshToken,
  type User,
} from "../../db/schema/index.js";
import {
  checkPasswordHash,
  makeJWT,
  makeRefreshToken,
} from "../../shared/auth.js";

export const loginService = {
  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  async getUserFromRefreshToken(token: string): Promise<User | null> {
    const [result] = await db
      .select({
        user: users,
        refreshToken: refreshTokens,
      })
      .from(refreshTokens)
      .innerJoin(users, eq(refreshTokens.userId, users.id))
      .where(eq(refreshTokens.token, token));

    if (
      !result ||
      result.refreshToken.revokedAt ||
      result.refreshToken.expiresAt < new Date()
    ) {
      return null;
    }

    return result.user;
  },

  async createRefreshToken(userId: string): Promise<string> {
    const token = makeRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60); // 60 days from now

    const newRefreshToken: NewRefreshToken = {
      token,
      userId,
      expiresAt,
      revokedAt: null,
    };

    await db.insert(refreshTokens).values(newRefreshToken);
    return token;
  },

  async revokeRefreshToken(token: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(refreshTokens.token, token));
  },

  async login(
    email: string,
    password: string
  ): Promise<
    | (Omit<User, "hashedPassword"> & { token: string; refreshToken: string })
    | null
  > {
    const user = await this.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await checkPasswordHash(
      password,
      user.hashedPassword
    );

    if (!isPasswordValid) {
      return null;
    }

    const oneHourInSeconds = 3600;
    const token = makeJWT(user.id, oneHourInSeconds, API_CONFIG.jwtSecret);

    const refreshToken = await this.createRefreshToken(user.id);

    const { hashedPassword, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      token,
      refreshToken,
    };
  },
};
