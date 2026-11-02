/** Loading skeletons that mirror the real layouts, so navigation feels like the page is arriving, not blank. */

export function HeaderSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="h-4 w-96 max-w-full animate-pulse rounded bg-muted" />
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-8 w-28 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6, cols = "sm:grid-cols-2" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border p-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-5 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CityBoardSkeleton() {
  return (
    <div className="space-y-8">
      <HeaderSkeleton />
      <div className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <CardGridSkeleton count={4} />
      </div>
      <div className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <CardGridSkeleton count={2} />
      </div>
    </div>
  );
}

export function PlaceSkeleton() {
  return (
    <div className="space-y-10">
      <HeaderSkeleton />
      <div className="space-y-3">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <CardGridSkeleton count={4} />
      </div>
      <div className="h-64 animate-pulse rounded-xl border bg-muted/40" />
    </div>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-xl border p-4">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-5 w-72 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
