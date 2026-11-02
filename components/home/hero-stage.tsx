"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSwarmCycle } from "@/components/particles/use-swarm-cycle";
import type { SwarmPalette } from "@/components/particles/particle-canvas";
import { buildShapes, shapeIndex } from "@/components/particles/nestvote-shapes";

const ParticleCanvas = dynamic(() => import("@/components/particles/particle-canvas"), { ssr: false, loading: () => null });

const DWELL_MS = 6000;

/** Emerald with amber sparks. */
const PALETTE: SwarmPalette = {
  deep: [0.02, 0.5, 0.36],
  mid: [0.3, 0.85, 0.6],
  ice: [0.96, 0.9, 0.7],
  floor: [0.9, 0.6, 0.2],
};

export interface HeroProfile {
  id: string;
  label: string;
  emoji: string;
  blurb: string;
}

const CHIP_SPOTS = [
  { left: "52%", top: "22%" },
  { left: "86%", top: "30%" },
  { left: "50%", top: "72%" },
  { left: "88%", top: "72%" },
] as const;

export function HeroStage({ profiles }: { profiles: HeroProfile[] }) {
  const { ref, inView, reduced, webgl, current, index, cycling, preview, release } = useSwarmCycle(profiles.length + 1, DWELL_MS);
  const profile = current < profiles.length ? profiles[current] : null;

  return (
    <div ref={ref} className="relative mt-12 h-[380px] sm:h-[460px] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,rgba(16,185,129,0.22),transparent)] lg:bg-[radial-gradient(30%_44%_at_72%_50%,rgba(16,185,129,0.2),transparent)]"
      />
      {webgl && (
        <div className="absolute inset-0">
          <ParticleCanvas shape={shapeIndex(profile ? profile.id : "nest")} active={inView} reduced={reduced} build={buildShapes} palette={PALETTE} />
        </div>
      )}

      <ul className="hidden xl:block">
        {profiles.map((p, i) => (
          <li key={p.id} className="absolute z-20 w-max -translate-x-1/2 -translate-y-1/2" style={CHIP_SPOTS[i % CHIP_SPOTS.length]}>
            <Link
              href={`/cities?profile=${p.id}`}
              onPointerEnter={() => preview(i)}
              onPointerLeave={() => release(i)}
              onFocus={() => preview(i)}
              onBlur={() => release(i)}
              style={{ animationDelay: `${i * -1.4}s` }}
              className={`group flex items-center gap-3 rounded-2xl border py-1.5 pl-1.5 pr-3.5 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 motion-safe:animate-[hero-float_7s_ease-in-out_infinite] ${
                i === current
                  ? "border-emerald-400/60 bg-emerald-950/70 shadow-[0_0_44px_-10px_rgba(52,211,153,0.85)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/25"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-xl ring-1 ring-white/10" aria-hidden>
                {p.emoji}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-white">{p.label}</span>
                <span className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/45">{p.blurb}</span>
              </span>
              <ArrowUpRight className="size-3.5 text-white/40 transition-colors group-hover:text-white" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 flex w-64 -translate-x-1/2 flex-col items-center gap-1.5 text-center lg:bottom-[8%] lg:left-[70%]">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300">Now shaping</span>
        <span className="text-lg font-light tracking-[-0.01em] text-white">{profile ? profile.label : "Your nest"}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">{profile ? "votes kept apart" : "confirmed by people like you"}</span>
        <span className="mt-1.5 h-px w-28 overflow-hidden bg-white/10">
          {cycling && (
            <span key={index} className="block h-full origin-left animate-[hero-dwell_linear_forwards] bg-emerald-400" style={{ animationDuration: `${DWELL_MS}ms` }} />
          )}
        </span>
      </div>
    </div>
  );
}
