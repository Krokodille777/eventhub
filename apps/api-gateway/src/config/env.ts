import { config as loadDotenv } from "dotenv";
import { z } from "zod";
loadDotenv();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PRISMA_LOG: z.enum(["query", "off"]).default("off")
});

export const env = envSchema.parse(process.env);
