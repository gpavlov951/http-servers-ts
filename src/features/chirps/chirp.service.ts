import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { chirps } from "../../db/schema/index.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors.js";
import type {
  CreateChirpRequest,
  CreateChirpResponse,
  GetAllChirpsResponse,
  GetChirpByIdResponse,
  ValidateChirpRequest,
  ValidateChirpResponse,
} from "./chirp.types.js";

function filterProfaneWords(body: string): string {
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  let cleanedBody = body;

  profaneWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    cleanedBody = cleanedBody.replace(regex, "****");
  });

  return cleanedBody;
}

export const chirpService = {
  validateChirp(data: ValidateChirpRequest): ValidateChirpResponse {
    const { body } = data;

    if (!body) {
      throw new BadRequestError("Missing required field: body");
    }

    if (typeof body !== "string") {
      throw new BadRequestError("Body must be a string");
    }

    if (body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const cleanedBody = filterProfaneWords(body);

    return {
      cleanedBody: cleanedBody,
    };
  },

  async getAllChirps(authorId?: string): Promise<GetAllChirpsResponse[]> {
    const baseQuery = db.select().from(chirps);

    const allChirps = authorId
      ? await baseQuery
          .where(eq(chirps.userId, authorId))
          .orderBy(asc(chirps.createdAt))
      : await baseQuery.orderBy(asc(chirps.createdAt));

    return allChirps.map((chirp) => ({
      id: chirp.id,
      createdAt: chirp.createdAt.toISOString(),
      updatedAt: chirp.updatedAt.toISOString(),
      body: chirp.body,
      userId: chirp.userId,
    }));
  },

  async getChirpById(id: string): Promise<GetChirpByIdResponse> {
    const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));

    if (!chirp) {
      throw new NotFoundError("Chirp not found");
    }

    return {
      id: chirp.id,
      createdAt: chirp.createdAt.toISOString(),
      updatedAt: chirp.updatedAt.toISOString(),
      body: chirp.body,
      userId: chirp.userId,
    };
  },

  async createChirp(data: CreateChirpRequest): Promise<CreateChirpResponse> {
    const { body, userId } = data;

    if (!body) {
      throw new BadRequestError("Missing required field: body");
    }

    if (!userId) {
      throw new BadRequestError("Missing required field: userId");
    }

    if (typeof body !== "string") {
      throw new BadRequestError("Body must be a string");
    }

    if (typeof userId !== "string") {
      throw new BadRequestError("UserId must be a string");
    }

    if (body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const cleanedBody = filterProfaneWords(body);

    const [newChirp] = await db
      .insert(chirps)
      .values({
        body: cleanedBody,
        userId: userId,
      })
      .returning();

    return {
      id: newChirp.id,
      createdAt: newChirp.createdAt.toISOString(),
      updatedAt: newChirp.updatedAt.toISOString(),
      body: newChirp.body,
      userId: newChirp.userId,
    };
  },

  async deleteChirp(id: string, userId: string): Promise<void> {
    const [chirp] = await db.select().from(chirps).where(eq(chirps.id, id));

    if (!chirp) {
      throw new NotFoundError("Chirp not found");
    }

    if (chirp.userId !== userId) {
      throw new ForbiddenError("You can only delete your own chirps");
    }

    await db.delete(chirps).where(eq(chirps.id, id));
  },
};
