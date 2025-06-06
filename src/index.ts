import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import express from "express";
import postgres from "postgres";
import { API_CONFIG } from "./config.js";
import { adminRouter, apiRouter } from "./routes/index.js";
import {
  middlewareErrorHandler,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./shared/middlewares.js";

const migrationClient = postgres(API_CONFIG.db.url, { max: 1 });
await migrate(drizzle(migrationClient), API_CONFIG.db.migrationConfig);

const app = express();

app.use(express.json());
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.use("/api", apiRouter);
app.use("/admin", adminRouter);

app.use(middlewareErrorHandler);

app.listen(API_CONFIG.api.port, () => {
  console.log(`Server is running at http://localhost:${API_CONFIG.api.port}`);
});
