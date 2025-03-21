import "dotenv/config";
import { z } from "zod";

//process.env

const envSchema = z.object({
  NODE_ENV: z
    .enum(["production", "test", "development"])
    .default("development"),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables!", _env.error.format());
  throw new Error("Invalid environment variables!");
}
export const env = _env.data;
