import { Router } from "express";
import { chirpController } from "./chirp.controller.js";

const chirpApiRoutes = Router();

chirpApiRoutes.get("/", chirpController.getAllChirps);
chirpApiRoutes.post("/", chirpController.createChirp);
chirpApiRoutes.post("/validate", chirpController.validateChirp);

export { chirpApiRoutes };
