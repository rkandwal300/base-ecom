"use client";

import Link from "next/link";

import { useAuthSession } from "@/components/auth/auth-session-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ProfileDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function AccountDashboard() {
  const { user } = useAuthSession();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Profile details aren’t loaded</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              You’re signed in, but the profile is only held in memory and
              isn’t available after a full page reload.
            </p>
            <p>
              Add a backend current-user endpoint, such as{" "}
              <code className="rounded bg-muted px-1 py-0.5">GET /auth/me</code>
              , to restore the profile from the secure access-token cookie.
            </p>
            <Link
              href="/auth"
              className="inline-flex font-medium text-foreground underline underline-offset-4"
            >
              Return to sign in
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            Account dashboard
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Welcome, {user.firstName}
          </h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Your profile</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-6 sm:grid-cols-2">
              <ProfileDetail
                label="Full name"
                value={`${user.firstName} ${user.lastName}`}
              />
              <ProfileDetail label="Username" value={user.username} />
              <ProfileDetail label="Email" value={user.email} />
              <ProfileDetail label="Gender" value={user.gender} />
              <ProfileDetail label="Role" value={user.role} />
              <ProfileDetail
                label="Seller account"
                value={user.sellerEnabled ? "Enabled" : "Not enabled"}
              />
            </dl>
          </CardContent>
        </Card>

        {user.image && (
          <Card>
            <CardHeader>
              <CardTitle>Profile image</CardTitle>
            </CardHeader>
            <CardContent>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-24 rounded-full border object-cover"
              />
            </CardContent>
          </Card>
        )}

        {user.businesses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your businesses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {user.businesses.map((business) => (
                <section key={business.id} className="space-y-2">
                  <h2 className="font-medium">{business.businessName}</h2>
                  {business.addresses.length > 0 ? (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {business.addresses.map((address) => (
                        <li key={address.id}>{address.formattedAddress}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No addresses have been added.
                    </p>
                  )}
                </section>
              ))}
            </CardContent>
          </Card>
        )}

        {user.latestSelectedAddress && (
          <Card>
            <CardHeader>
              <CardTitle>Latest selected address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {user.latestSelectedAddress.formattedAddress}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
