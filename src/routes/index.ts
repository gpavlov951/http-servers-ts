import { Router } from "express";
import { chirpApiRoutes } from "../features/chirps/chirp.routes.js";
import {
  healthAdminRoutes,
  healthApiRoutes,
} from "../features/health/health.routes.js";
import { userApiRoutes } from "../features/users/user.routes.js";

const apiRouter = Router();
const adminRouter = Router();

apiRouter.use("/users", userApiRoutes);
apiRouter.use("/chirps", chirpApiRoutes);
apiRouter.use("/", healthApiRoutes);

adminRouter.use("/", healthAdminRoutes);

export { adminRouter, apiRouter };
