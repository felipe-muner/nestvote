"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface HeroSlide {
  src: string;
  name: string;
  country: string;
}

const INTERVAL_MS = 6500;

/** Full-bleed background carousel: crossfades between destination photos, each drifting slowly. */
export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {slides.map((s, i) => (
        <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}>
          <Image
            src={s.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover ${i === index ? "motion-safe:animate-[kenburns_14s_ease-out_forwards]" : ""}`}
          />
        </div>
      ))}
      {/* Overlays: darker on the left for the copy, fading into the page colour at the bottom. */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,9,0.92)_0%,rgba(6,17,9,0.72)_42%,rgba(6,17,9,0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#061109] to-transparent" />

      <div className="pointer-events-auto absolute bottom-6 right-5 flex items-center gap-3 sm:right-8 lg:right-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">
          {slides[index]?.name}, {slides[index]?.country}
        </span>
        <span className="flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Show ${s.name}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-emerald-400" : "w-2 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
