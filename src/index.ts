import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { API_CONFIG } from "./config.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(middlewareLogResponses);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/plain");
  res.send("OK");
}

function handlerMetrics(req: Request, res: Response) {
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

function handlerReset(req: Request, res: Response) {
  API_CONFIG.fileserverHits = 0;
  res.setHeader("Content-Type", "text/plain");
  res.send("Reset successful");
}

function handlerValidateChirp(req: Request, res: Response) {
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
    res.status(400).json({
      error: "Chirp is too long",
    });
    return;
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
