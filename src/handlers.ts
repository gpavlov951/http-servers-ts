import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "./config";
import { BadRequestError } from "./errors";

export function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.send("OK");
}

export function handlerMetrics(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.send(`
    <html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${API_CONFIG.fileserverHits} times!</p>
      </body>
    </html>
  `);
}

export function handlerReset(req: Request, res: Response) {
  API_CONFIG.fileserverHits = 0;
  res.setHeader("Content-Type", "text/plain");
  res.send("Reset successful");
}

export function handlerValidateChirp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { body } = req.body;

    if (!body) {
      res.status(400).json({
        error: "Missing required field: body",
      });
      return;
    }

    if (typeof body !== "string") {
      res.status(400).json({
        error: "Body must be a string",
      });
      return;
    }

    if (body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    let cleanedBody = body;

    profaneWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleanedBody = cleanedBody.replace(regex, "****");
    });

    res.status(200).json({
      cleanedBody: cleanedBody,
    });
  } catch (error) {
    next(error);
  }
}
