import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, PROFILES, isProfileId } from "@/lib/profiles";
import { getCityBoard, getCityBySlug, rankForProfile } from "@/lib/queries";
import { PlaceCard } from "@/components/place-card";
import { ProfileTabs } from "@/components/profile-tabs";
import { Button } from "@/components/ui/button";

export default function CityPage(props: PageProps<"/[city]">) {
  return (
    <Suspense fallback={<CitySkeleton />}>
      <CityBoard params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function CityBoard({ params, searchParams }: Pick<PageProps<"/[city]">, "params" | "searchParams">) {
  const [{ city: citySlug }, sp] = await Promise.all([params, searchParams]);
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();

  const profile = isProfileId(sp.profile) ? sp.profile : "nomad";
  const meta = PROFILES[profile];
  const board = await getCityBoard(city.id);
  const ranked = rankForProfile(board, profile);
  const recommendedCount = ranked.filter((p) => p.stats[profile].recommended).length;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{city.country}</p>
        <h1 className="text-3xl font-bold tracking-tight">{city.name}</h1>
        {city.tagline ? <p className="text-muted-foreground">{city.tagline}</p> : null}
        <ProfileTabs basePath={`/${city.slug}`} active={profile} />
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>
            {meta.emoji} {meta.tagline}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" render={<Link href={`/${city.slug}/tips?profile=${profile}`} />}>Insider tips: groups, discounts, long-term deals</Button>
          <Button size="sm" variant="ghost" render={<Link href={`/submit?city=${city.slug}`} />}>Add a place</Button>
        </div>
        <p className="text-sm">
          <strong>{recommendedCount}</strong> of {ranked.length} places confirmed for {meta.plural} so far.
        </p>
      </div>

      {meta.needs.map((cat) => {
        const list = ranked.filter((p) => p.category === cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="space-y-3">
            <h2 className="text-xl font-semibold">
              {CATEGORIES[cat].emoji} {CATEGORIES[cat].question}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((p) => (
                <PlaceCard key={p.id} place={p} citySlug={city.slug} profile={profile} />
              ))}
            </div>
          </section>
        );
      })}

      {ranked.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing here yet. <Link className="underline" href={`/submit?city=${city.slug}`}>Add the first place</Link>.
        </p>
      ) : null}
    </div>
  );
}

function CitySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-4 w-80 animate-pulse rounded bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl border bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
