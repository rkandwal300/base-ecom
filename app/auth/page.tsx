import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";

type AuthPageProps = {
  searchParams: Promise<{
    callbackUrl?: string | string[];
  }>;
};

function getSafeCallbackUrl(value: string | string[] | undefined) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/";
  }

  return value;
}

async function AuthContent({ searchParams }: AuthPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthCard callbackUrl={getSafeCallbackUrl(callbackUrl)} />
  );
}

export default function AuthPage({ searchParams }: AuthPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-100 px-4 py-10 sm:px-6">
      <Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading sign in…</p>
        }
      >
        <AuthContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
