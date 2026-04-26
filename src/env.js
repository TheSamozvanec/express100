import { z } from "zod/v4";
import debugLib from "debug";

const debug = debugLib('exp:src:env');
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  HASH_SALT: z.coerce.number().min(4).max(14).default(10),
  COOKIE_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().default("120m"),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().default(5432),
});

try {
  // eslint-disable-next-line node/no-process-env
  envSchema.parse(process.env);
}
catch (error) {
  if (error instanceof z.ZodError) {
    debug("Missing environment variables:", error.issues.flatMap(issue => issue.path));
  }
  else {
    debug(error);
  }
  process.exit(1);
}

debug ('env loaded!');
// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
//debug (env)
