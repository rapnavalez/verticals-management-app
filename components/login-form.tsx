"use client";

import { useActionState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { loginAction, type LoginState } from "@/app/login/actions";

const c = copy.auth.login;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, action, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    null,
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} noValidate>
            <FieldGroup>
              <Field data-invalid={!!state?.errors?.email}>
                <FieldLabel htmlFor="email">{c.emailLabel}</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={c.emailPlaceholder}
                  autoComplete="email"
                  aria-invalid={!!state?.errors?.email}
                />
                <FieldError>{state?.errors?.email}</FieldError>
              </Field>
              <Field data-invalid={!!state?.errors?.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{c.passwordLabel}</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
                    tabIndex={-1}
                  >
                    {c.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!state?.errors?.password}
                />
                <FieldError>{state?.errors?.password}</FieldError>
              </Field>
              <Field>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner />}
                  {isPending ? c.submitPending : c.submitIdle}
                </Button>
                <FieldDescription className="text-center">
                  {c.signupPrompt}{" "}
                  <Link
                    href="/signup"
                    className="underline-offset-4 hover:underline"
                  >
                    {c.signupLink}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
