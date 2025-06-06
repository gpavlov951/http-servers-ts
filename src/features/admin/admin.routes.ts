import { Router } from "express";
import { adminController } from "./admin.controller.js";

const adminRoutes = Router();

adminRoutes.get("/metrics", adminController.metrics);
adminRoutes.post("/reset", adminController.reset);

export { adminRoutes };
