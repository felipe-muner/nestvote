import { Suspense } from "react";
import { PROFILES, isProfileId } from "@/lib/profiles";
import { getCities } from "@/lib/queries";
import { CityCard } from "@/components/city-card";
import { ProfileTabs } from "@/components/profile-tabs";
import { CardGridSkeleton, HeaderSkeleton } from "@/components/skeletons";

export const metadata = { title: "Cities" };

export default function CitiesPage(props: PageProps<"/cities">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <HeaderSkeleton />
          <CardGridSkeleton count={6} cols="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      }
    >
      <CityList searchParams={props.searchParams} />
    </Suspense>
  );
}

async function CityList({ searchParams }: Pick<PageProps<"/cities">, "searchParams">) {
  const sp = await searchParams;
  const profile = isProfileId(sp.profile) ? sp.profile : "nomad";
  const q = typeof sp.q === "string" ? sp.q : "";
  const meta = PROFILES[profile];
  const rows = await getCities(q);
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-300/90">Cities</p>
        <h1 className="font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">Pick a city. <span className="font-heading italic text-white/55">Then pick who you are.</span></h1>
        <p className="text-muted-foreground">{meta.tagline}</p>
        <div className="light-tabs">
          <ProfileTabs basePath="/cities" active={profile} />
        </div>
        <form action="/cities" className="flex max-w-md gap-2">
          <input type="hidden" name="profile" value={profile} />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search a city or country"
            className="h-10 flex-1 rounded-full border bg-background px-4 text-sm"
            aria-label="Search a city or country"
          />
        </form>
        {q && rows.length === 0 ? <p className="text-sm text-muted-foreground">No city matches &ldquo;{q}&rdquo; yet. Add a place in it and it will appear.</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ city, placeCount, voteCount }) => (
          <CityCard key={city.id} city={city} placeCount={placeCount} voteCount={voteCount} href={`/${city.slug}?profile=${profile}`} />
        ))}
      </div>
    </div>
  );
}
