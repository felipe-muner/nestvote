import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BadgeCheck, ExternalLink, Laptop, MapPin, Sprout } from "lucide-react";
import { auth } from "@/lib/auth";
import { CATEGORIES, PROFILES, PROFILE_IDS, RECOMMEND_MIN_VOTES, isProfileId } from "@/lib/profiles";
import { getPlace } from "@/lib/queries";
import { ProfileBadge } from "@/components/profile-badge";
import { ReviewForm } from "@/components/review-form";
import { Stars } from "@/components/stars";

export default function PlacePage(props: PageProps<"/[city]/[place]">) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border bg-muted/40" />}>
      <PlaceDetail params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function PlaceDetail({ params, searchParams }: Pick<PageProps<"/[city]/[place]">, "params" | "searchParams">) {
  const [{ city: citySlug, place: placeSlug }, sp, session] = await Promise.all([params, searchParams, auth()]);
  const place = await getPlace(citySlug, placeSlug);
  if (!place) notFound();
  const defaultProfile = isProfileId(sp.profile) ? sp.profile : "nomad";
  const cat = CATEGORIES[place.category];

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link className="underline" href={`/${place.city.slug}?profile=${defaultProfile}`}>
            {place.city.name}
          </Link>{" "}
          · {cat.emoji} {cat.label}
          {place.priceLevel ? <span className="ml-2">{"$".repeat(place.priceLevel)}</span> : null}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{place.name}</h1>
        {place.description ? <p className="max-w-2xl text-muted-foreground">{place.description}</p> : null}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {place.address ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" /> {place.address}
            </span>
          ) : null}
          {place.website ? (
            <a className="inline-flex items-center gap-1 underline" href={place.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" /> Website
            </a>
          ) : null}
          {place.acceptsVolunteers ? (
            <span className="inline-flex items-center gap-1">
              <Sprout className="size-4" /> Takes volunteers
            </span>
          ) : null}
          {place.workFriendly ? (
            <span className="inline-flex items-center gap-1">
              <Laptop className="size-4" /> Work-friendly
            </span>
          ) : null}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Who recommends it</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PROFILE_IDS.map((p) => {
            const s = place.stats[p];
            const meta = PROFILES[p];
            return (
              <div key={p} className={`rounded-xl border p-4 ${s.recommended ? "border-emerald-400/60" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <ProfileBadge profile={p} />
                  {s.votes > 0 ? <Stars value={s.avg} /> : null}
                </div>
                <p className="mt-2 text-sm">
                  {s.votes === 0 ? (
                    <span className="text-muted-foreground">No {meta.plural} have voted yet. Be the first.</span>
                  ) : s.recommended ? (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-300">
                      <BadgeCheck className="size-4" /> {s.avg.toFixed(1)} stars from {s.votes} {meta.plural}. Recommended.
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {s.avg.toFixed(1)} stars from {s.votes} {s.votes === 1 ? meta.label.toLowerCase() : meta.plural}.{" "}
                      {s.votes < RECOMMEND_MIN_VOTES ? `${RECOMMEND_MIN_VOTES - s.votes} more to confirm.` : "Not recommended by this group."}
                    </span>
                  )}
                </p>
                {s.costReports > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Median cost reported: {s.medianMonthlyCostUsd === 0 ? "free" : `$${s.medianMonthlyCostUsd}/month`} ({s.costReports}{" "}
                    {s.costReports === 1 ? "report" : "reports"}).
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your vote</h2>
        <ReviewForm placeId={place.id} citySlug={place.city.slug} placeSlug={place.slug} defaultProfile={defaultProfile} signedIn={Boolean(session?.user)} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What people said</h2>
        {place.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No written reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {place.reviews.map((r) => (
              <li key={r.id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ProfileBadge profile={r.profile} />
                    <span className="text-sm font-medium">{r.userName ?? "Traveler"}</span>
                  </div>
                  <Stars value={r.rating} />
                </div>
                {r.body ? <p className="mt-2 text-sm">{r.body}</p> : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {[
                    r.stayDays ? `${r.stayDays} days` : null,
                    r.monthlyCostUsd != null ? (r.monthlyCostUsd === 0 ? "free" : `$${r.monthlyCostUsd}/month`) : null,
                    r.visitedYear ? String(r.visitedYear) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
