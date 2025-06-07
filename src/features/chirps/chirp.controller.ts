import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "../../config.js";
import { getBearerToken, validateJWT } from "../../shared/auth.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { chirpService } from "./chirp.service.js";

export const chirpController = {
  async getAllChirps(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await chirpService.getAllChirps();
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
};
