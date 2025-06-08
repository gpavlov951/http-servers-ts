import { defineConfig } from "drizzle-kit";
import { API_CONFIG } from "./src/config";

export default defineConfig({
  schema: "./dist/db/schema/index.js",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: API_CONFIG.db.url,
  },
});
