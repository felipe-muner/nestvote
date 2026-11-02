import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { coverFor } from "@/lib/images";
import { CATEGORIES, PROFILES, isProfileId } from "@/lib/profiles";
import { getCityBoard, getCityBySlug, getCityCostSnapshot, rankForProfile } from "@/lib/queries";
import { HeroBanner } from "@/components/hero-banner";
import { PlaceCard } from "@/components/place-card";
import { ProfileTabs } from "@/components/profile-tabs";
import { CityBoardSkeleton } from "@/components/skeletons";
import { StatStrip } from "@/components/stat-strip";
import { Button } from "@/components/ui/button";

export async function generateMetadata(props: PageProps<"/[city]">) {
  const { city: slug } = await props.params;
  const city = await getCityBySlug(slug);
  if (!city) return { title: "Not found" };
  return {
    title: `${city.name}, ${city.country}`,
    description: city.tagline ?? `Where to sleep, eat, work and have fun in ${city.name}, voted by nomads, volunteers, lush travelers and expats.`,
  };
}

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
  const profileVotes = ranked.reduce((n, p) => n + p.stats[profile].votes, 0);

  return (
    <div className="space-y-8">
      <HeroBanner image={coverFor(city.slug)} alt={`${city.name}, ${city.country}`} eyebrow={city.country} title={city.name} subtitle={city.tagline}>
        <ProfileTabs basePath={`/${city.slug}`} active={profile} />
      </HeroBanner>

      <div className="space-y-4">
        <p className="text-lg">
          <span aria-hidden>{meta.emoji}</span> {meta.tagline}
        </p>
        <StatStrip
          items={[
            { label: "Places", value: String(ranked.length) },
            { label: `Confirmed for ${meta.plural}`, value: String(recommendedCount) },
            { label: `${meta.label} votes`, value: String(profileVotes) },
            {
              label: "Median bed / month",
              value: cost.reports === 0 ? "—" : cost.medianMonthlyCostUsd === 0 ? "Free" : `$${cost.medianMonthlyCostUsd}`,
            },
          ]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" render={<Link href={`/${city.slug}/tips?profile=${profile}`} />}>
            <Lightbulb className="size-4" /> Insider tips: groups, discounts, long-term deals
          </Button>
          <Button variant="ghost" render={<Link href={`/submit?city=${city.slug}`} />}>
            <Plus className="size-4" /> Add a place
          </Button>
          <span className="text-xs text-muted-foreground">Votes are weighted by stay length.</span>
        </div>
      </div>

      {meta.needs.map((cat) => {
        const list = ranked.filter((p) => p.category === cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl">
                <span aria-hidden>{CATEGORIES[cat].emoji}</span> {CATEGORIES[cat].question}
              </h2>
              <span className="text-sm text-muted-foreground">
                {list.filter((p) => p.stats[profile].recommended).length} of {list.length} confirmed
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
