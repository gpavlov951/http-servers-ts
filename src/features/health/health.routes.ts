import { Router } from "express";
import { healthController } from "./health.controller.js";

const healthApiRoutes = Router();
const healthAdminRoutes = Router();

healthApiRoutes.get("/healthz", healthController.readiness);

healthAdminRoutes.get("/metrics", healthController.metrics);
healthAdminRoutes.post("/reset", healthController.reset);

export { healthAdminRoutes, healthApiRoutes };
