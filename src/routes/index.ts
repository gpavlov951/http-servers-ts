import { Router } from "express";
import { adminRoutes } from "../features/admin/admin.routes.js";
import { chirpApiRoutes } from "../features/chirps/chirp.routes.js";
import { healthApiRoutes } from "../features/health/health.routes.js";
import { userController } from "../features/users/user.controller.js";
import { userApiRoutes } from "../features/users/user.routes.js";

const apiRouter = Router();
const adminRouter = Router();

apiRouter.use("/users", userApiRoutes);
apiRouter.use("/chirps", chirpApiRoutes);
apiRouter.use("/", healthApiRoutes);

apiRouter.post("/login", userController.login);

adminRouter.use("/", adminRoutes);

export { adminRouter, apiRouter };
