import { defineConfig } from "drizzle-kit";
import { API_CONFIG } from "./src/config";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: API_CONFIG.db.url,
  },
});
