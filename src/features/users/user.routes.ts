import { Router } from "express";
import { userController } from "./user.controller.js";

const userApiRoutes = Router();

userApiRoutes.get("/", userController.getUsers);
userApiRoutes.get("/:id", userController.getUserById);
userApiRoutes.post("/", userController.createUser);
userApiRoutes.put("/:id", userController.updateUser);
userApiRoutes.delete("/:id", userController.deleteUser);

export { userApiRoutes };
