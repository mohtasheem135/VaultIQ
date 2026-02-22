import type { Metadata } from "next";
import { APP_NAME, APP_DESCRIPTION } from "@/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — Sign In`,
  description: APP_DESCRIPTION,
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">{APP_NAME}</span>
        </div>

        <div className="space-y-3">
          <blockquote className="text-2xl font-medium leading-snug">
            "Upload anything.
            <br />
            Find everything."
          </blockquote>
          <p className="text-zinc-400 text-sm">
            Intelligent document search powered by AI embeddings.
          </p>
        </div>

        <p className="text-zinc-500 text-xs">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>

      {/* Right — Form Panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">{APP_NAME}</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
