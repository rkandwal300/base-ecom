import Link from "next/link";

export default function ProductsPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-medium text-slate-500">Public catalog</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          Products
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
          This products page is available without signing in. Connect it to the
          products endpoint to show the catalog.
        </p>
        <Link
          href="/auth"
          className="mt-7 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Sign in
        </Link>
      </section>
    </main>
  );
}
