import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { APP_NAME } from "@/constants";
// ✅ removed requireAuth import — it's for API routes only

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ✅ redirect() is the correct way to guard layouts — never NextResponse
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/30">
      <MobileHeader />

      <div className="flex h-screen lg:h-auto">
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
          <Sidebar className="w-64" />
        </div>

        <main className="flex-1 lg:pl-64 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
