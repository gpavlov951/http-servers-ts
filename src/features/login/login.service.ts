import { eq } from "drizzle-orm";
import { API_CONFIG } from "../../config.js";
import { db } from "../../db/index.js";
import { users, type User } from "../../db/schema/users.js";
import { checkPasswordHash, makeJWT } from "../../shared/auth.js";

export const loginService = {
  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  async login(
    email: string,
    password: string,
    expiresInSeconds?: number
  ): Promise<(Omit<User, "hashedPassword"> & { token: string }) | null> {
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
    let tokenExpiresIn = oneHourInSeconds;

    if (expiresInSeconds !== undefined) {
      tokenExpiresIn = Math.min(expiresInSeconds, oneHourInSeconds);
    }

    const token = makeJWT(user.id, tokenExpiresIn, API_CONFIG.jwtSecret);

    const { hashedPassword, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token,
    };
  },
};
