import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "../../config.js";
import { getBearerToken, makeJWT } from "../../shared/auth.js";
import { loginService } from "./login.service.js";
import type { LoginRequest } from "./login.types.js";

export const loginController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const user = await loginService.login(email, password);

      if (!user) {
        res.status(401).json({ error: "Incorrect email or password" });
        return;
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = getBearerToken(req);
      const user = await loginService.getUserFromRefreshToken(refreshToken);

      if (!user) {
        res.status(401).json({ error: "Invalid or expired refresh token" });
        return;
      }

      const oneHourInSeconds = 3600;
      const token = makeJWT(user.id, oneHourInSeconds, API_CONFIG.jwtSecret);

      res.json({ token });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Authorization")) {
        res.status(401).json({ error: "Invalid or expired refresh token" });
        return;
      }
      next(error);
    }
  },

  async revoke(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = getBearerToken(req);
      await loginService.revokeRefreshToken(refreshToken);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("Authorization")) {
        res.status(401).json({ error: "Invalid refresh token" });
        return;
      }
      next(error);
    }
  },
};
