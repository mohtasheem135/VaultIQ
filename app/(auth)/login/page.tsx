import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/constants";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: `Sign In — ${APP_NAME}`,
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your {APP_NAME} account
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
