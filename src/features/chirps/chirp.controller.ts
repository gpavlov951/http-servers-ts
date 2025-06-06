import type { NextFunction, Request, Response } from "express";
import { chirpService } from "./chirp.service.js";

export const chirpController = {
  validateChirp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = chirpService.validateChirp(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
