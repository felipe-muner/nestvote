import Link from "next/link";
import { BadgeCheck, Laptop, Sprout } from "lucide-react";
import type { ProfileId } from "@/lib/db/schema";
import { CATEGORIES, PROFILES, PROFILE_IDS, RECOMMEND_MIN_VOTES } from "@/lib/profiles";
import type { PlaceWithStats } from "@/lib/queries";
import { Stars } from "@/components/stars";
import { cn } from "@/lib/utils";

export function PlaceCard({ place, citySlug, profile }: { place: PlaceWithStats; citySlug: string; profile: ProfileId }) {
  const s = place.stats[profile];
  const meta = PROFILES[profile];
  const cat = CATEGORIES[place.category];
  return (
    <Link
      href={`/${citySlug}/${place.slug}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40",
        s.recommended && "border-emerald-400/60 dark:border-emerald-500/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {cat.emoji} {cat.label}
            {place.priceLevel ? <span className="ml-2">{"$".repeat(place.priceLevel)}</span> : null}
          </p>
          <h3 className="font-semibold leading-tight group-hover:underline">{place.name}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {s.votes > 0 ? (
            <>
              <Stars value={s.avg} />
              <p className="text-xs text-muted-foreground">
                {s.avg.toFixed(1)} from {s.votes} {s.votes === 1 ? meta.label.toLowerCase() : meta.plural}
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">No {meta.plural} voted yet</p>
          )}
        </div>
      </div>

      {place.description ? <p className="line-clamp-2 text-sm text-muted-foreground">{place.description}</p> : null}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        {s.recommended ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
            <BadgeCheck className="size-3.5" /> Recommended for {meta.plural}
          </span>
        ) : s.votes > 0 && s.votes < RECOMMEND_MIN_VOTES ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
            {RECOMMEND_MIN_VOTES - s.votes} more {meta.label.toLowerCase()} vote{RECOMMEND_MIN_VOTES - s.votes === 1 ? "" : "s"} to confirm
          </span>
        ) : null}
        {place.acceptsVolunteers ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
            <Sprout className="size-3.5" /> Takes volunteers
          </span>
        ) : null}
        {place.workFriendly ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
            <Laptop className="size-3.5" /> Work-friendly
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {PROFILE_IDS.filter((p) => p !== profile && place.stats[p].votes > 0).map((p) => (
          <span key={p}>
            {PROFILES[p].emoji} {place.stats[p].avg.toFixed(1)} · {place.stats[p].votes}
          </span>
        ))}
      </div>
    </Link>
  );
}
