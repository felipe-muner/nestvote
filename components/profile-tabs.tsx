import Link from "next/link";
import type { ProfileId } from "@/lib/db/schema";
import { PROFILE_LIST } from "@/lib/profiles";
import { cn } from "@/lib/utils";

/** Server-rendered "tabs": each one is a link, so every profile view has its own URL to share. */
export function ProfileTabs({ basePath, active }: { basePath: string; active: ProfileId }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Traveler profile">
      {PROFILE_LIST.map((p) => (
        <Link
          key={p.id}
          href={`${basePath}?profile=${p.id}`}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
            p.id === active ? "border-white bg-white text-black shadow" : "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 [.light-tabs_&]:border-border [.light-tabs_&]:bg-transparent [.light-tabs_&]:text-foreground [.light-tabs_&]:hover:bg-accent",
          )}
          aria-current={p.id === active ? "page" : undefined}
        >
          <span aria-hidden>{p.emoji}</span>
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
