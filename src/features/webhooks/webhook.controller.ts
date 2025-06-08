import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "src/shared/errors.js";
import { API_CONFIG } from "../../config.js";
import { getAPIKey } from "../../shared/auth.js";
import { userService } from "../users/user.service.js";
import type { PolkaWebhookRequest } from "./webhook.types.js";

export const webhookController = {
  async handlePolkaWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const apiKey = getAPIKey(req);

      if (apiKey !== API_CONFIG.polkaKey) {
        res.status(401).send();
        return;
      }

      const webhookData: PolkaWebhookRequest = req.body;

      if (webhookData.event !== "user.upgraded") {
        res.status(204).send();
        return;
      }

      await userService.upgradeUserToChirpyRed(webhookData.data.userId);

      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("API key")) {
        next(new UnauthorizedError(error.message));
        return;
      }

      next(error);
    }
  },
};
