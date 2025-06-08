import { Router } from "express";
import { webhookController } from "./webhook.controller.js";

const polkaWebhookRoutes = Router();

polkaWebhookRoutes.post("/webhooks", webhookController.handlePolkaWebhook);

export { polkaWebhookRoutes };
