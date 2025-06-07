import { Router } from "express";
import { chirpController } from "./chirp.controller.js";

const chirpApiRoutes = Router();

chirpApiRoutes.get("/", chirpController.getAllChirps);
chirpApiRoutes.get("/:chirpID", chirpController.getChirpById);
chirpApiRoutes.post("/", chirpController.createChirp);
chirpApiRoutes.post("/validate", chirpController.validateChirp);

export { chirpApiRoutes };
