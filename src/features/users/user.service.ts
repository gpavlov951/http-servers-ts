import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, type NewUser, type User } from "../../db/schema/users.js";
import { hashPassword } from "../../shared/auth.js";
import { NotFoundError } from "../../shared/errors.js";
import type { CreateUserRequest, UpdateUserRequest } from "./user.types.js";

export const userService = {
  async getAllUsers(): Promise<Omit<User, "hashedPassword">[]> {
    const allUsers = await db.select().from(users);
    return allUsers.map(({ hashedPassword, ...user }) => user);
  },

  async getUserById(id: string): Promise<Omit<User, "hashedPassword">> {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async createUser(
    userData: CreateUserRequest
  ): Promise<Omit<User, "hashedPassword">> {
    const hashedPasswordValue = await hashPassword(userData.password);

    const newUser: NewUser = {
      email: userData.email,
      hashedPassword: hashedPasswordValue,
    };

    const [result] = await db
      .insert(users)
      .values(newUser)
      .onConflictDoNothing()
      .returning();

    if (!result) {
      throw new Error("Failed to create user");
    }

    const { hashedPassword, ...userWithoutPassword } = result;
    return userWithoutPassword;
  },

  async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<Omit<User, "hashedPassword">> {
    const [result] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!result) {
      throw new NotFoundError("User not found");
    }

    const { hashedPassword, ...userWithoutPassword } = result;
    return userWithoutPassword;
  },

  async deleteUser(id: string): Promise<void> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();

    if (result.length === 0) {
      throw new NotFoundError("User not found");
    }
  },

  async deleteAllUsers(): Promise<void> {
    await db.delete(users);
  },
};
