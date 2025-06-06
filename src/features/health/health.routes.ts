import { Router } from "express";
import { healthController } from "./health.controller.js";

const healthApiRoutes = Router();

healthApiRoutes.get("/healthz", healthController.readiness);

export { healthApiRoutes };
