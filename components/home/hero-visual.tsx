import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { coverFor } from "@/lib/images";
import { PROFILES } from "@/lib/profiles";
import { getCities, getHeroHighlights } from "@/lib/queries";
import { HeroCarousel } from "@/components/home/hero-carousel";

/** Background: a carousel of the cities' photos. */
export async function HeroBackground() {
  const rows = await getCities();
  const slides = rows.map(({ city }) => ({ src: coverFor(city.slug, 2000, 1250), name: city.name, country: city.country }));
  return <HeroCarousel slides={slides} />;
}

const SPOTS = ["left-[2%] top-[6%]", "right-[0%] top-[30%]", "left-[8%] top-[54%]", "right-[6%] top-[78%]"] as const;

/** The strongest confirmed place per profile, floating over the photo. */
export async function HeroHighlights() {
  const highlights = await getHeroHighlights();
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[480px] lg:h-[520px] lg:max-w-none">
      <span className="absolute left-[2%] top-[-10%] rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">
        Confirmed this month
      </span>
      {highlights.map((h, i) => {
        const meta = PROFILES[h.profile];
        return (
          <Link
            key={h.profile}
            href={`/${h.citySlug}/${h.slug}?profile=${h.profile}`}
            style={{ animationDelay: `${i * -1.7}s` }}
            className={`absolute z-10 flex w-[min(80%,320px)] items-center gap-3 rounded-2xl border border-white/10 bg-[#0a1a11]/80 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:border-emerald-400/60 motion-safe:animate-[hero-float_7s_ease-in-out_infinite] ${SPOTS[i % SPOTS.length]}`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-xl ring-1 ring-white/10" aria-hidden>
              {meta.emoji}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-medium text-white">{h.name}</span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/50">
                {h.city} · {h.avg.toFixed(1)} from {h.votes} {meta.plural}
              </span>
            </span>
            <BadgeCheck className="size-4 shrink-0 text-emerald-400" />
          </Link>
        );
      })}
    </div>
  );
}

export function HeroHighlightsSkeleton() {
  return <div className="mx-auto h-[420px] w-full max-w-[560px] sm:h-[480px] lg:h-[520px] lg:max-w-none" />;
}
