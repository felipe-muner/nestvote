import { cn } from "@/lib/utils";

/**
 * NestVote mark: a woven nest with a checkmark rising out of it.
 * Plain SVG with inline attributes so it also renders inside next/og share images.
 */
export function LogoMark({
  size = 28,
  nest = "#D97706",
  check = "#059669",
  className,
}: {
  size?: number;
  nest?: string;
  check?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="NestVote"
      className={className}
    >
      {/* nest bowl: three woven strands */}
      <path d="M9 35 A23 23 0 0 0 55 35" stroke={nest} strokeWidth="6" strokeLinecap="round" />
      <path d="M16 39 A16 14 0 0 0 48 39" stroke={nest} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M23 44 A9 8 0 0 0 41 44" stroke={nest} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      {/* rim highlights, like straw ends */}
      <path d="M6 31 L12 35" stroke={nest} strokeWidth="4" strokeLinecap="round" />
      <path d="M58 31 L52 35" stroke={nest} strokeWidth="4" strokeLinecap="round" />
      {/* checkmark rising from the nest */}
      <path d="M21 27 L30 36 L50 12" stroke={check} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, markSize = 28 }: { className?: string; markSize?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={markSize} />
      <span className="font-heading text-xl font-semibold tracking-tight">
        Nest<span className="text-emerald-700 dark:text-emerald-400">Vote</span>
      </span>
    </span>
  );
}
