import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "../../config.js";
import { getBearerToken, validateJWT } from "../../shared/auth.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { userService } from "./user.service.js";

export const userController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await userService.updateUser(id, userData);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async updateAuthenticatedUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = getBearerToken(req);
      const userId = validateJWT(token, API_CONFIG.jwtSecret);

      const userData = req.body;
      const user = await userService.updateAuthenticatedUser(userId, userData);
      res.json(user);
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
