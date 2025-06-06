import type { NextFunction, Request, Response } from "express";
import { API_CONFIG } from "./config";
import { isCustomError } from "./errors";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`
      );

      return;
    }

    console.log(`[OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
  });

  next();
}

export function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction
) {
  API_CONFIG.fileserverHits++;
  next();
}

export function middlewareErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);

  if (isCustomError(err)) {
    res.status(err.statusCode).json({
      error: err.message,
    });

    return;
  }

  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
