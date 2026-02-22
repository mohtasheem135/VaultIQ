import { createClient } from "@/supabase/server";
import { errorResponse } from "./api-response";
import type { User } from "@supabase/supabase-js";

type GuardResult =
  | { user: User; error: null }
  | { user: null; error: ReturnType<typeof errorResponse> };

// Verifies auth and returns the user or an error response
export async function requireAuth(): Promise<GuardResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: errorResponse("Unauthorized", 401) };
  }

  return { user, error: null };
}
