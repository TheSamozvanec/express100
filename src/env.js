import { z } from "zod/v4";
import debugLib from "debug";

const debug = debugLib('exp:src:env');
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
});

try {
  // eslint-disable-next-line node/no-process-env
  envSchema.parse(process.env);
}
catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Missing environment variables:", error.issues.flatMap(issue => issue.path));
  }
  else {
    console.error(error);
  }
  process.exit(1);
}

debug ('env iclode!');
// eslint-disable-next-line node/no-process-env
export const env = envSchema.parse(process.env);
