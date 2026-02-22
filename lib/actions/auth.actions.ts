"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LoginFormValues, RegisterFormValues } from "@/lib/validations/auth.schema";
import { createClient } from "@/supabase/server";

export async function loginAction(values: LoginFormValues) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/upload");
}

export async function registerAction(values: Omit<RegisterFormValues, "confirm_password">) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: { full_name: values.full_name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/upload");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
