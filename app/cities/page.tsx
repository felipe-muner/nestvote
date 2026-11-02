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
  const meta = PROFILES[profile];
  const rows = await getCities();
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Pick a city</h1>
        <p className="text-muted-foreground">{meta.tagline}</p>
        <ProfileTabs basePath="/cities" active={profile} />
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
