import { config } from "dotenv";
import { z } from "zod";

//process.env
if (process.env.NODE_ENV == "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["production", "test", "development"])
    .default("development"),
  DATABE_CLIENT: z.enum(["sqLite", "pg"]),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables!");
}
export const env = _env.data;
