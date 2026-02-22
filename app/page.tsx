import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { requireAuth } from "@/lib/utils/api-guard";

export default async function RootPage() {
  const { user } = await requireAuth();

  // Authenticated → go to app, unauthenticated → go to login
  if (user) {
    redirect("/upload");
  } else {
    redirect("/login");
  }
}
