import type { Request, Response } from "express";
import { API_CONFIG } from "../../config.js";
import { userService } from "../users/user.service.js";

export const adminController = {
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

  async reset(req: Request, res: Response) {
    if (API_CONFIG.platform !== "dev") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    try {
      API_CONFIG.api.fileserverHits = 0;

      await userService.deleteAllUsers();

      res.setHeader("Content-Type", "text/plain");
      res.send("Reset successful");
    } catch (error) {
      console.error("Error during reset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
