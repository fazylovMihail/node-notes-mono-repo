import path from "path";
import dotenv from "dotenv";
import type { Knex } from "knex";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });
}

const currentEnv = process.env.NODE_ENV || "development";

const environments: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: path.resolve(process.cwd(), "server/src/db/migrations"),
    },
    seeds: {
      directory: path.resolve(process.cwd(), "server/src/db/seeds"),
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl:
        process.env.DB_SSL === "true" || process.env.DB_URL
          ? { rejectUnauthorized: false }
          : false,
    },
    pool: {
      min: 0,
      max: 2,
    },
    migrations: {
      directory: path.resolve(process.cwd(), "server/src/db/migrations"),
    },
    seeds: {
      directory: path.resolve(process.cwd(), "server/src/db/seeds"),
    },
  },
};

const config: Knex.Config = environments[currentEnv];

export default config;
