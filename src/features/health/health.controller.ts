import type { Request, Response } from "express";
import { API_CONFIG } from "../../config.js";

export const healthController = {
  readiness(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/plain");
    res.send("OK");
  },

  metrics(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    res.send(`
      <html>
        <body>
          <h1>Welcome, Chirpy Admin</h1>
          <p>Chirpy has been visited ${API_CONFIG.api.fileserverHits} times!</p>
        </body>
      </html>
    `);
  },

  reset(req: Request, res: Response) {
    API_CONFIG.api.fileserverHits = 0;
    res.setHeader("Content-Type", "text/plain");
    res.send("Reset successful");
  },
};
