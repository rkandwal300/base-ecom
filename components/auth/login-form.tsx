"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AuthTextField } from "@/components/auth/auth-text-field";
import { logIn } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field"; 
import type { AuthUser } from "@/types/auth";

type LoginFormProps = {
  onSuccess: (user: AuthUser) => void;
  onError: (message: string) => void;
};

export function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form
      className="mt-8"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        try {
          onSuccess(await logIn(values));
        } catch (error) {
          onError(getApiErrorMessage(error));
        }
      })}
    >
      <FieldGroup>
        <AuthTextField
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          registration={register("email")}
        />
        <AuthTextField
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          registration={register("password")}
        />
        <p className="-mt-2 text-xs leading-5 text-muted-foreground">
          Use at least 6 characters, including uppercase and lowercase letters
          and a number.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-xl text-sm font-semibold"
        >
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
