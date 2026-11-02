import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, BadgeCheck, Users, Vote } from "lucide-react";
import { HERO_IMAGE } from "@/lib/images";
import { PROFILE_LIST } from "@/lib/profiles";
import { getCities } from "@/lib/queries";
import { CityCard } from "@/components/city-card";
import { CardGridSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative left-1/2 w-screen -translate-x-1/2 h-[34rem] overflow-hidden">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center text-white">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-white/80">Places voted by people who travel like you</p>
          <h1 className="max-w-3xl text-5xl leading-[1.05] sm:text-7xl">Stop researching what someone like you already confirmed.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/85">
            A digital nomad, a volunteer, a lush traveler and an expat need different things from the same city. NestVote keeps
            their votes apart, so &ldquo;5 stars from 10 volunteers&rdquo; means exactly that.
          </p>
          <form action="/cities" className="mt-8 flex w-full max-w-lg gap-2 rounded-full bg-white/95 p-1.5 shadow-lg">
            <input
              name="q"
              type="search"
              placeholder="Where are you going?"
              className="h-11 flex-1 rounded-full bg-transparent px-4 text-base text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search a city or country"
            />
            <Button type="submit" size="lg" className="rounded-full px-6">
              Search
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PROFILE_LIST.map((p) => (
              <Link
                key={p.id}
                href={`/cities?profile=${p.id}`}
                className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm backdrop-blur transition-colors hover:bg-white/20"
              >
                {p.emoji} {p.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl">Cities</h2>
            <p className="text-muted-foreground">Pick one, then pick who you are.</p>
          </div>
          <Button variant="outline" render={<Link href="/cities" />}>
            All cities <ArrowRight className="size-4" />
          </Button>
        </div>
        <Suspense fallback={<CardGridSkeleton count={6} cols="sm:grid-cols-2 lg:grid-cols-3" />}>
          <CityGrid />
        </Suspense>
      </section>

      {/* Profiles */}
      <section className="space-y-5">
        <div>
          <h2 className="text-3xl">How do you travel?</h2>
          <p className="text-muted-foreground">Every rating is given as one of these four. That is the whole idea.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROFILE_LIST.map((p) => (
            <Link
              key={p.id}
              href={`/cities?profile=${p.id}`}
              className={`group flex flex-col gap-3 rounded-2xl border p-6 transition-shadow hover:shadow-md ${p.color}`}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-white/70 text-2xl shadow-sm dark:bg-black/30" aria-hidden>
                  {p.emoji}
                </span>
                <h3 className="text-2xl">{p.label}</h3>
              </div>
              <p className="text-sm opacity-90">{p.tagline}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold">
                Pick a city <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="grid gap-6 rounded-3xl border bg-muted/30 p-8 sm:grid-cols-3">
        {[
          { icon: Vote, title: "Vote as who you were", body: "Rate a place as a nomad, volunteer, lush traveler or expat. One vote per person, per profile, per place." },
          { icon: BadgeCheck, title: "Enough votes confirm it", body: "Three or more people of a profile averaging 4 stars make a place recommended for that profile. Long stays weigh more." },
          { icon: Users, title: "Expats share the inside track", body: "Facebook and WhatsApp groups, long-term rates and discounts that a three-day tourist never hears about." },
        ].map((s) => (
          <div key={s.title} className="space-y-2">
            <s.icon className="size-6" />
            <h3 className="text-xl">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </section>

      {/* Why */}
      <section className="mx-auto max-w-3xl space-y-4 text-center">
        <h2 className="text-3xl">Why this exists</h2>
        <p className="text-lg text-muted-foreground">
          I spent three years volunteering around the world with almost no money, then worked online from the same places. Each
          time I searched for answers hundreds of people before me had already found. Re-searching what previous travelers
          already confirmed is a waste of everyone&rsquo;s time. This is where those confirmations live.
        </p>
        <Button size="lg" render={<Link href="/submit" />}>
          Add the place that saved your trip
        </Button>
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(({ city, placeCount, voteCount }) => (
        <CityCard key={city.id} city={city} placeCount={placeCount} voteCount={voteCount} href={`/${city.slug}`} />
      ))}
    </div>
  );
}
