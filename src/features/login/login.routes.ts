import { Router } from "express";
import { loginController } from "./login.controller.js";

const loginApiRoutes = Router();

loginApiRoutes.post("/", loginController.login);

export { loginApiRoutes };
