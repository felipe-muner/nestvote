import Image from "next/image";
import type { ReactNode } from "react";

/** Full-width photo banner used on city and place pages. */
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
    <section className={`relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8 ${compact ? "h-56 sm:h-64" : "h-72 sm:h-96"}`}>
      <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-5xl px-4 pb-6 text-white sm:px-6 lg:px-8">
        {eyebrow ? <div className="mb-1 text-sm text-white/80">{eyebrow}</div> : null}
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-base text-white/85 sm:text-lg">{subtitle}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </section>
  );
}
