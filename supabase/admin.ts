import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// ⚠️  NEVER import this file in any client component or expose to the browser
// This client bypasses all RLS policies
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
