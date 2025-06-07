import type { NextFunction, Request, Response } from "express";
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
};
