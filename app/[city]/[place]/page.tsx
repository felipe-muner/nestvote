import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { BadgeCheck, ExternalLink, Laptop, MapPin, Sprout } from "lucide-react";
import { auth } from "@/lib/auth";
import { coverFor } from "@/lib/images";
import { CATEGORIES, PROFILES, PROFILE_IDS, RECOMMEND_MIN_VOTES, isProfileId } from "@/lib/profiles";
import { getPlace } from "@/lib/queries";
import { HeroBanner } from "@/components/hero-banner";
import { ProfileBadge } from "@/components/profile-badge";
import { ReviewForm } from "@/components/review-form";
import { PlaceSkeleton } from "@/components/skeletons";
import { Stars } from "@/components/stars";

export async function generateMetadata(props: PageProps<"/[city]/[place]">) {
  const { city, place: placeSlug } = await props.params;
  const place = await getPlace(city, placeSlug);
  if (!place) return { title: "Not found" };
  const best = PROFILE_IDS.filter((p) => place.stats[p].recommended).map((p) => PROFILES[p].plural);
  return {
    title: `${place.name} · ${place.city.name}`,
    description: best.length > 0 ? `Recommended for ${best.join(", ")}. ${place.description ?? ""}`.trim() : place.description ?? `${place.name} in ${place.city.name} on NestVote.`,
  };
}

export default function PlacePage(props: PageProps<"/[city]/[place]">) {
  return (
    <Suspense fallback={<PlaceSkeleton />}>
      <PlaceDetail params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function PlaceDetail({ params, searchParams }: Pick<PageProps<"/[city]/[place]">, "params" | "searchParams">) {
  await connection();
  const [{ city: citySlug, place: placeSlug }, sp, session] = await Promise.all([params, searchParams, auth()]);
  const place = await getPlace(citySlug, placeSlug);
  if (!place) notFound();
  const defaultProfile = isProfileId(sp.profile) ? sp.profile : "nomad";
  const cat = CATEGORIES[place.category];
  const confirmedFor = PROFILE_IDS.filter((p) => place.stats[p].recommended);

  return (
    <div className="space-y-8">
      <HeroBanner
        compact
        image={coverFor(place.city.slug)}
        alt={place.city.name}
        eyebrow={
          <>
            <Link className="underline" href={`/${place.city.slug}?profile=${defaultProfile}`}>
              {place.city.name}
            </Link>{" "}
            · {cat.emoji} {cat.label}
            {place.priceLevel ? <span className="ml-2">{"$".repeat(place.priceLevel)}</span> : null}
          </>
        }
        title={place.name}
      >
        {confirmedFor.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {confirmedFor.map((p) => (
              <span key={p} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-sm font-medium text-white">
                <BadgeCheck className="size-4" /> Recommended for {PROFILES[p].plural}
              </span>
            ))}
          </div>
        ) : null}
      </HeroBanner>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          <section className="space-y-3">
            {place.description ? <p className="text-lg text-muted-foreground">{place.description}</p> : null}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl">Who recommends it</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROFILE_IDS.map((p) => {
                const s = place.stats[p];
                const meta = PROFILES[p];
                return (
                  <div key={p} className={`rounded-2xl border p-4 ${s.recommended ? "border-emerald-400/60 bg-emerald-50/40 dark:bg-emerald-950/20" : ""}`}>
                    <div className="flex items-center justify-between gap-2">
                      <ProfileBadge profile={p} />
                      {s.votes > 0 ? <Stars value={s.avg} /> : null}
                    </div>
                    <p className="mt-3 font-heading text-3xl font-semibold leading-none">{s.votes > 0 ? s.avg.toFixed(1) : "—"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.votes === 0
                        ? `No ${meta.plural} have voted yet.`
                        : s.recommended
                          ? `${s.votes} ${meta.plural} · recommended`
                          : `${s.votes} ${s.votes === 1 ? meta.label.toLowerCase() : meta.plural} · ${s.votes < RECOMMEND_MIN_VOTES ? `${RECOMMEND_MIN_VOTES - s.votes} more to confirm` : "not recommended"}`}
                    </p>
                    {s.costReports > 0 ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Median cost {s.medianMonthlyCostUsd === 0 ? "free" : `$${s.medianMonthlyCostUsd}/month`} ({s.costReports} {s.costReports === 1 ? "report" : "reports"})
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl">What people said</h2>
            {place.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No written reviews yet.</p>
            ) : (
              <ul className="space-y-3">
                {place.reviews.map((r) => (
                  <li key={r.id} className="rounded-2xl border p-4">
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

        <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
          <h2 className="text-2xl">Your vote</h2>
          <ReviewForm placeId={place.id} citySlug={place.city.slug} placeSlug={place.slug} defaultProfile={defaultProfile} signedIn={Boolean(session?.user)} />
        </aside>
      </div>
    </div>
  );
}
