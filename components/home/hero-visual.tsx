import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { HERO_IMAGE } from "@/lib/images";
import { PROFILES } from "@/lib/profiles";
import { getHeroHighlights } from "@/lib/queries";

const SPOTS = [
  "left-[-6%] top-[14%]",
  "right-[-5%] top-[34%]",
  "left-[4%] bottom-[22%]",
  "right-[8%] bottom-[6%]",
] as const;

/** A destination photo drifting slowly, with real confirmed places floating over it. */
export async function HeroVisual() {
  const highlights = await getHeroHighlights();
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] sm:aspect-[5/6] lg:max-w-none">
      <div className="absolute inset-0 overflow-hidden rounded-[32px] ring-1 ring-white/15 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover motion-safe:animate-[kenburns_38s_ease-in-out_infinite_alternate]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061109] via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">
          Confirmed this month
        </span>
      </div>
      {highlights.map((h, i) => {
        const meta = PROFILES[h.profile];
        return (
          <Link
            key={h.profile}
            href={`/${h.citySlug}/${h.slug}?profile=${h.profile}`}
            style={{ animationDelay: `${i * -1.7}s` }}
            className={`absolute z-10 flex w-[min(78%,300px)] items-center gap-3 rounded-2xl border border-white/10 bg-[#0a1a11]/85 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-colors hover:border-emerald-400/60 motion-safe:animate-[hero-float_7s_ease-in-out_infinite] ${SPOTS[i % SPOTS.length]}`}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-xl ring-1 ring-white/10" aria-hidden>
              {meta.emoji}
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-medium text-white">{h.name}</span>
              <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/45">
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

export function HeroVisualSkeleton() {
  return <div className="mx-auto aspect-[4/5] w-full max-w-[520px] animate-pulse rounded-[32px] bg-white/[0.04] ring-1 ring-white/10 sm:aspect-[5/6] lg:max-w-none" />;
}
