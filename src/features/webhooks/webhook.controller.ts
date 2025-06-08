import type { NextFunction, Request, Response } from "express";
import { userService } from "../users/user.service.js";
import type { PolkaWebhookRequest } from "./webhook.types.js";

export const webhookController = {
  async handlePolkaWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const webhookData: PolkaWebhookRequest = req.body;

      if (webhookData.event !== "user.upgraded") {
        res.status(204).send();
        return;
      }

      await userService.upgradeUserToChirpyRed(webhookData.data.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
