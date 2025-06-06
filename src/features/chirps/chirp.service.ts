import { db } from "../../db/index.js";
import { chirps } from "../../db/schema/index.js";
import { BadRequestError } from "../../shared/errors.js";
import type {
  CreateChirpRequest,
  CreateChirpResponse,
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
};
