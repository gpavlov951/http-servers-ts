import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { API_CONFIG } from "./config.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerMetrics);
app.get("/reset", handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.send("OK");
}

function handlerMetrics(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.send(`Hits: ${API_CONFIG.fileserverHits}`);
}

function handlerReset(req: Request, res: Response) {
  API_CONFIG.fileserverHits = 0;
  res.setHeader("Content-Type", "text/plain");
  res.send("Reset successful");
}

function middlewareLogResponses(
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

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  API_CONFIG.fileserverHits++;
  next();
}
