import { defineConfig } from "drizzle-kit";
import { API_CONFIG } from "./src/config.js";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: API_CONFIG.db.url,
  },
});
