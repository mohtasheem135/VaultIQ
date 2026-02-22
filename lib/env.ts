import { z } from "zod";

const envSchema = z.object({
  // Supabase — public (safe to expose to browser)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .min(1)
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),

  // Supabase — server only
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // Google Gemini — server only
  GOOGLE_API_KEY: z
    .string()
    .min(1, "GOOGLE_API_KEY is required"),

  // Upstash — server only
  UPSTASH_REDIS_REST_URL: z
    .string()
    .min(1)
    .url("UPSTASH_REDIS_REST_URL must be a valid URL"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1, "UPSTASH_REDIS_REST_TOKEN is required"),

  // App config
  NEXT_PUBLIC_APP_URL: z
    .string()
    .min(1)
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_MAX_FILE_SIZE_MB: z
    .string()
    .default("50")
    .transform(Number)
    .pipe(z.number().min(1).max(500)),
});

// Throws at boot time if any required variable is missing
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:\n");
  parsed.error.errors.forEach((err) => {
    console.error(`  ${err.path.join(".")}: ${err.message}`);
  });
  throw new Error("Fix environment variables before starting the app.");
}

export const env = parsed.data;
