import { Router } from "express";
import { loginController } from "./login.controller.js";

const loginApiRoutes = Router();

loginApiRoutes.post("/", loginController.login);

const refreshApiRoutes = Router();

refreshApiRoutes.post("/refresh", loginController.refresh);
refreshApiRoutes.post("/revoke", loginController.revoke);

export { loginApiRoutes, refreshApiRoutes };
