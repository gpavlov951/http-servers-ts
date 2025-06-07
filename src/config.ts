import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

const platform = ["dev", "prod"] as const;
type Platform = (typeof platform)[number];

type APIConfig = {
  api: {
    port: number;
    fileserverHits: number;
  };
  db: { url: string; migrationConfig: MigrationConfig };
  platform: Platform;
  jwtSecret: string;
};

export const API_CONFIG: APIConfig = {
  api: {
    port: 8080,
    fileserverHits: 0,
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: {
      migrationsFolder: "./src/db/migrations",
    },
  },
  platform: envOrThrowEnum("PLATFORM", [...platform]),
  jwtSecret: envOrThrow("JWT_SECRET"),
};

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

function envOrThrowEnum<T extends string>(key: string, enumValues: T[]): T {
  const value = process.env[key];
  if (!value || !enumValues.includes(value as T)) {
    throw new Error(`Environment variable ${key} is not set or invalid`);
  }
  return value as T;
}
