import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, type User } from "../../db/schema/users.js";
import { checkPasswordHash } from "../../shared/auth.js";

export const loginService = {
  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  },

  async login(
    email: string,
    password: string
  ): Promise<Omit<User, "hashedPassword"> | null> {
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

    const { hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
