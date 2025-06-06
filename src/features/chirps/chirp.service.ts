import { BadRequestError } from "../../shared/errors.js";
import type {
  ValidateChirpRequest,
  ValidateChirpResponse,
} from "./chirp.types.js";

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

    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    let cleanedBody = body;

    profaneWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleanedBody = cleanedBody.replace(regex, "****");
    });

    return {
      cleanedBody: cleanedBody,
    };
  },
};
