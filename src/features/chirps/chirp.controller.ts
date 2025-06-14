import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "../../config.js";
import { getBearerToken, validateJWT } from "../../shared/auth.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { chirpService } from "./chirp.service.js";

export const chirpController = {
  async getAllChirps(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorId: authorIdQuery, sort } = req.query;
      const sortParam = sort === "desc" ? "desc" : "asc";

      let authorId = "";
      if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
      }

      const result = await chirpService.getAllChirps(authorId, sortParam);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getChirpById(req: Request, res: Response, next: NextFunction) {
    try {
      const { chirpID } = req.params;
      const result = await chirpService.getChirpById(chirpID);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  validateChirp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = chirpService.validateChirp(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async createChirp(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getBearerToken(req);
      const userId = validateJWT(token, API_CONFIG.jwtSecret);

      const chirpData = {
        ...req.body,
        userId: userId,
      };

      const result = await chirpService.createChirp(chirpData);
      res.status(201).json(result);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Authorization header") ||
          error.message.includes("Invalid token") ||
          error.message.includes("Token expired"))
      ) {
        next(new UnauthorizedError(error.message));
        return;
      }
      next(error);
    }
  },

  async deleteChirp(req: Request, res: Response, next: NextFunction) {
    try {
      const token = getBearerToken(req);
      const userId = validateJWT(token, API_CONFIG.jwtSecret);
      const { chirpID } = req.params;

      await chirpService.deleteChirp(chirpID, userId);
      res.status(204).send();
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("Authorization header") ||
          error.message.includes("Invalid token") ||
          error.message.includes("Token expired"))
      ) {
        next(new UnauthorizedError(error.message));
        return;
      }
      next(error);
    }
  },
};
