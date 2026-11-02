export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-[28rem] animate-pulse rounded-xl border bg-muted/40" />
    </div>
  );
}
