import { Outlet, createRootRoute, Link } from "@tanstack/react-router";

function RootLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-md border bg-card p-4 text-card-foreground">Loading...</div>
    </div>
  );
}

function RootError({ error }: { error: Error }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-3 rounded-md border bg-destructive/10 p-4">
        <h2 className="font-semibold text-destructive">Something went wrong</h2>
        <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{error.message}</pre>
        <Link to="/" preload="intent" className="underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  pendingComponent: RootLoading,
  errorComponent: RootError,
  component: () => (
    <div className="min-h-dvh bg-background text-foreground min-w-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </div>
    </div>
  ),
});
