import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, PROFILES, isProfileId } from "@/lib/profiles";
import { getCityBoard, getCityBySlug, getCityCostSnapshot, rankForProfile } from "@/lib/queries";
import { PlaceCard } from "@/components/place-card";
import { ProfileTabs } from "@/components/profile-tabs";
import { Button } from "@/components/ui/button";
import { CityBoardSkeleton } from "@/components/skeletons";

export default function CityPage(props: PageProps<"/[city]">) {
  return (
    <Suspense fallback={<CityBoardSkeleton />}>
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
  const [board, costs] = await Promise.all([getCityBoard(city.id), getCityCostSnapshot(city.id)]);
  const cost = costs[profile];
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
          {cost.reports > 0 ? (
            <>
              {" "}
              {meta.plural[0].toUpperCase() + meta.plural.slice(1)} report a median of{" "}
              <strong>{cost.medianMonthlyCostUsd === 0 ? "free" : `$${cost.medianMonthlyCostUsd}/month`}</strong> for a place to sleep
              ({cost.reports} {cost.reports === 1 ? "report" : "reports"}).
            </>
          ) : null}
        </p>
        <p className="text-xs text-muted-foreground">Votes are weighted by stay length: two months counts more than a weekend, never more than six weekends.</p>
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
