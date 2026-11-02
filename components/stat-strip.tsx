export function StatStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="bg-card px-4 py-4">
          <p className="font-heading text-2xl font-semibold leading-none">{it.value}</p>
          <p className="mt-1.5 text-xs uppercase tracking-wide text-muted-foreground">{it.label}</p>
        </div>
      ))}
    </div>
  );
}
