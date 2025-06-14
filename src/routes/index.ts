import { Router } from "express";
import { adminRoutes } from "../features/admin/admin.routes.js";
import { chirpApiRoutes } from "../features/chirps/chirp.routes.js";
import { healthApiRoutes } from "../features/health/health.routes.js";
import {
  loginApiRoutes,
  refreshApiRoutes,
} from "../features/login/login.routes.js";
import { userApiRoutes } from "../features/users/user.routes.js";
import { polkaWebhookRoutes } from "../features/webhooks/webhook.routes.js";

const apiRouter = Router();
const adminRouter = Router();

apiRouter.use("/users", userApiRoutes);
apiRouter.use("/chirps", chirpApiRoutes);
apiRouter.use("/", healthApiRoutes);
apiRouter.use("/login", loginApiRoutes);
apiRouter.use("/", refreshApiRoutes);
apiRouter.use("/polka", polkaWebhookRoutes);

adminRouter.use("/", adminRoutes);

export { adminRouter, apiRouter };
