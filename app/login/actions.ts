"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { copy } from "@/lib/copy";

export type LoginState = {
  errors?: {
    email?: string;
    password?: string;
  };
} | null;

const e = copy.auth.login.errors;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;

  const errors: NonNullable<LoginState>["errors"] = {};

  if (!email) {
    errors.email = e.emailRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = e.emailInvalid;
  }

  if (!password) {
    errors.password = e.passwordRequired;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { errors: { email: e.emailNotConfirmed } };
    }
    return { errors: { password: e.invalidCredentials } };
  }

  redirect("/dashboard");
}
