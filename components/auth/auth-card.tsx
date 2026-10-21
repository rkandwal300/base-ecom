"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthSession } from "@/components/auth/auth-session-provider";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import type { AuthUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { AuthMode } from "@/schemas/auth.schema";

type AuthCardProps = {
  callbackUrl: string;
};

export function AuthCard({ callbackUrl }: AuthCardProps) {
  const router = useRouter();
  const { setUser } = useAuthSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [notice, setNotice] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const isLogin = mode === "login";

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice(null);
  }

  function handleAuthSuccess(authenticatedUser: AuthUser) {
    setUser(authenticatedUser);
    setNotice({
      message: `Welcome, ${authenticatedUser.firstName}.`,
      isError: false,
    });
    router.replace(callbackUrl);
  }

  function handleAuthError(message: string) {
    setNotice({ message, isError: true });
  }

  return (
    <Card className="w-full max-w-lg gap-0 rounded-3xl border border-slate-200/80 bg-white py-0 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.28)] ring-0">
      <CardContent className="p-6 sm:p-10">

        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-slate-500">
            {isLogin ? "Welcome back" : "Get started"}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin
              ? "Enter your details to continue."
              : "Fill in your details to create an account."}
          </p>
        </div>

        <Tabs
          value={mode}
          onValueChange={(value) => {
            if (value === "login" || value === "signup") {
              changeMode(value);
            }
          }}
        >
          <TabsList className="h-10 w-full rounded-xl bg-slate-100 p-1">
            <TabsTrigger value="login" className="h-9 rounded-lg">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="h-9 rounded-lg">
              Sign up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm
              key="login"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm
              key="signup"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </TabsContent>
        </Tabs>

        {notice && (
          <p
            role={notice.isError ? "alert" : "status"}
            className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-5 ${
              notice.isError
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : "border-emerald-200 bg-emerald-50 text-emerald-900"
            }`}
          >
            {notice.message}
          </p>
        )}

        <p className="mt-7 text-center text-sm text-slate-500">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <Button
            type="button"
            variant="link"
            onClick={() => changeMode(isLogin ? "signup" : "login")}
            className="h-auto p-0 font-semibold text-slate-900"
          >
            {isLogin ? "Sign up" : "Log in"}
          </Button>
        </p>
      </CardContent>
    </Card>
  );
}
