import type { Knex } from "knex";
import { env } from "./src/env";

const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_URL == "sqLite"
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts",
  },
};

export default config;
