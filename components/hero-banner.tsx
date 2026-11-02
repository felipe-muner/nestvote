import Image from "next/image";
import type { ReactNode } from "react";

/** Contained photo banner used on city, place and tips pages. */
export function HeroBanner({
  image,
  alt,
  eyebrow,
  title,
  subtitle,
  children,
  compact = false,
}: {
  image: string;
  alt: string;
  eyebrow?: ReactNode;
  title: string;
  subtitle?: string | null;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden rounded-[32px] ring-1 ring-white/15 ${compact ? "h-64 sm:h-72" : "h-80 sm:h-[26rem]"}`}>
      <Image src={image} alt={alt} fill priority sizes="(min-width: 1400px) 1400px, 100vw" className="object-cover motion-safe:animate-[kenburns_38s_ease-in-out_infinite_alternate]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#061109] via-[#061109]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
        {eyebrow ? <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">{eyebrow}</div> : null}
        <h1 className="font-sans text-4xl font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-3 max-w-2xl text-base text-white/75 sm:text-lg">{subtitle}</p> : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </section>
  );
}
