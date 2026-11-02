import Link from "next/link";
import { Suspense } from "react";
import { MapPin } from "lucide-react";
import { PROFILES, isProfileId } from "@/lib/profiles";
import { getCities } from "@/lib/queries";
import { ProfileTabs } from "@/components/profile-tabs";

export const metadata = { title: "Cities" };

export default function CitiesPage(props: PageProps<"/cities">) {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading cities...</p>}>
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
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Pick a city</h1>
        <p className="text-muted-foreground">{meta.tagline}</p>
        <ProfileTabs basePath="/cities" active={profile} />
        <form action="/cities" className="flex max-w-md gap-2">
          <input type="hidden" name="profile" value={profile} />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search a city or country"
            className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm"
            aria-label="Search a city or country"
          />
        </form>
        {q && rows.length === 0 ? <p className="text-sm text-muted-foreground">No city matches &ldquo;{q}&rdquo; yet. Add a place in it and it will appear.</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ city, placeCount, voteCount }) => (
          <Link key={city.id} href={`/${city.slug}?profile=${profile}`} className="group rounded-xl border p-4 transition-colors hover:bg-accent/40">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> {city.country}
            </div>
            <h2 className="font-semibold group-hover:underline">{city.name}</h2>
            {city.tagline ? <p className="line-clamp-2 text-sm text-muted-foreground">{city.tagline}</p> : null}
            <p className="mt-2 text-xs text-muted-foreground">
              {placeCount} places · {voteCount} votes
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
