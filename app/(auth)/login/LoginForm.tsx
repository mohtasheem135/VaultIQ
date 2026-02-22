"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth.schema";
import { loginAction } from "@/lib/actions/auth.actions";
import { FormField } from "@/components/shared/FormField";
import { AlertMessage } from "@/components/shared/AlertMessage";
import { LoadingButton } from "@/components/shared/LoadingButton";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    const result = await loginAction(values);
    if (result?.error) {
      setServerError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <AlertMessage type="error" message={serverError} />
      )}

      <FormField
        id="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="space-y-1.5">
        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <LoadingButton
        type="submit"
        isLoading={isSubmitting}
        loadingText="Signing in..."
        className="w-full bg-indigo-500 hover:bg-indigo-600"
      >
        Sign in
      </LoadingButton>
    </form>
  );
}
