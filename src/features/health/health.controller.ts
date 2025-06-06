import type { Request, Response } from "express";

export const healthController = {
  readiness(req: Request, res: Response) {
    res.setHeader("Content-Type", "text/plain");
    res.send("OK");
  },
};
