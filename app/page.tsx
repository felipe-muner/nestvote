import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { PROFILE_LIST } from "@/lib/profiles";
import { getCities } from "@/lib/queries";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6 pt-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Places voted by people who travel like you</p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Stop researching what someone like you already confirmed.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A digital nomad, a volunteer, a lush traveler and an expat need different things from the same city. NestVote
          keeps their votes apart, so &ldquo;5 stars from 10 volunteers&rdquo; means exactly that.
        </p>
        <form action="/cities" className="mx-auto flex max-w-md gap-2">
          <input
            name="q"
            type="search"
            placeholder="Search a city or country"
            className="h-10 flex-1 rounded-lg border bg-background px-3 text-sm"
            aria-label="Search a city or country"
          />
          <Button type="submit" size="lg">
            Search
          </Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How do you travel?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROFILE_LIST.map((p) => (
            <Link
              key={p.id}
              href={`/cities?profile=${p.id}`}
              className="group flex flex-col gap-2 rounded-xl border p-5 transition-colors hover:bg-accent/40"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {p.emoji}
                </span>
                <h3 className="text-lg font-semibold group-hover:underline">{p.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium">
                Pick a city <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cities</h2>
          <Button variant="ghost" size="sm" render={<Link href="/submit" />}>Add a place</Button>
        </div>
        <Suspense fallback={<CityGridSkeleton />}>
          <CityGrid />
        </Suspense>
      </section>

      <section className="grid gap-6 rounded-xl border bg-muted/30 p-6 sm:grid-cols-3">
        <div>
          <h3 className="font-semibold">1. Vote as who you were</h3>
          <p className="text-sm text-muted-foreground">Rate a place as a nomad, volunteer, lush traveler or expat. One vote per profile per place.</p>
        </div>
        <div>
          <h3 className="font-semibold">2. Enough votes make it recommended</h3>
          <p className="text-sm text-muted-foreground">Three or more people of a profile averaging 4 stars confirm a place for that profile. No single opinion decides.</p>
        </div>
        <div>
          <h3 className="font-semibold">3. Expats share the inside track</h3>
          <p className="text-sm text-muted-foreground">Facebook and WhatsApp groups, long-term rates and discounts that a tourist on a three-day trip never hears about.</p>
        </div>
      </section>
    </div>
  );
}

async function CityGrid() {
  const rows = await getCities();
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No cities yet. Run the seed script or add the first place.</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(({ city, placeCount, voteCount }) => (
        <Link key={city.id} href={`/${city.slug}`} className="group rounded-xl border p-4 transition-colors hover:bg-accent/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> {city.country}
          </div>
          <h3 className="font-semibold group-hover:underline">{city.name}</h3>
          {city.tagline ? <p className="line-clamp-2 text-sm text-muted-foreground">{city.tagline}</p> : null}
          <p className="mt-2 text-xs text-muted-foreground">
            {placeCount} places · {voteCount} votes
          </p>
        </Link>
      ))}
    </div>
  );
}

function CityGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl border bg-muted/40" />
      ))}
    </div>
  );
}
