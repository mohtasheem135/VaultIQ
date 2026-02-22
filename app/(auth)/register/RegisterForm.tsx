"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth.schema";
import { registerAction } from "@/lib/actions/auth.actions";
import { FormField } from "@/components/shared/FormField";
import { AlertMessage } from "@/components/shared/AlertMessage";
import { LoadingButton } from "@/components/shared/LoadingButton";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    const { confirm_password, ...payload } = values;
    const result = await registerAction(payload);
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
        id="full_name"
        label="Full name"
        type="text"
        placeholder="Mohtasheem Ejaz"
        autoComplete="name"
        error={errors.full_name?.message}
        {...register("full_name")}
      />

      <FormField
        id="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormField
        id="confirm_password"
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      <LoadingButton
        type="submit"
        isLoading={isSubmitting}
        loadingText="Creating account..."
        className="w-full bg-indigo-500 hover:bg-indigo-600"
      >
        Create account
      </LoadingButton>
    </form>
  );
}
