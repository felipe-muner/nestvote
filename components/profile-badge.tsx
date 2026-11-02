import type { ProfileId } from "@/lib/db/schema";
import { PROFILES } from "@/lib/profiles";
import { cn } from "@/lib/utils";

export function ProfileBadge({ profile, className }: { profile: ProfileId; className?: string }) {
  const meta = PROFILES[profile];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", meta.color, className)}>
      <span aria-hidden>{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
