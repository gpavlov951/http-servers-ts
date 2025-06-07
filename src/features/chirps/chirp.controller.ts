import type { NextFunction, Request, Response } from "express";
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
      const result = await chirpService.createChirp(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
};
