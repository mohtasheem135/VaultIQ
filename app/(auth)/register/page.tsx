import type { Metadata } from "next";
import Link from "next/link";
import { APP_NAME } from "@/constants";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: `Create Account — ${APP_NAME}`,
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Start uploading and searching your documents
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
