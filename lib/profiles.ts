import type { CategoryId, ProfileId, TipKind } from "@/lib/db/schema";

export type ProfileMeta = {
  id: ProfileId;
  label: string;
  plural: string;
  emoji: string;
  tagline: string;
  /** What this profile cares about, in order. Drives the city page sections. */
  needs: CategoryId[];
  color: string;
};

export const PROFILES: Record<ProfileId, ProfileMeta> = {
  nomad: {
    id: "nomad",
    label: "Digital nomad",
    plural: "digital nomads",
    emoji: "💻",
    tagline: "You work online. You need a bed, fast wifi, good food and a reason to stay a month.",
    needs: ["work", "sleep", "food", "fun", "community"],
    color: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100",
  },
  volunteer: {
    id: "volunteer",
    label: "Volunteer",
    plural: "volunteers",
    emoji: "🌱",
    tagline: "Little money, lots of time. Sleep and eat for free in exchange for a few hours of help, and live the place.",
    needs: ["sleep", "food", "community", "fun"],
    color: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100",
  },
  luxury: {
    id: "luxury",
    label: "Lush traveler",
    plural: "lush travelers",
    emoji: "🥂",
    tagline: "Budget is not the question. Where is it really worth it, according to people who paid?",
    needs: ["sleep", "food", "fun"],
    color: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100",
  },
  expat: {
    id: "expat",
    label: "Expat",
    plural: "expats",
    emoji: "🏡",
    tagline: "You live here. You know the groups, the long-term deals and the discounts tourists never get.",
    needs: ["community", "sleep", "food", "work", "fun"],
    color: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-100",
  },
};

export const PROFILE_LIST = Object.values(PROFILES);

export const CATEGORIES: Record<CategoryId, { label: string; emoji: string; question: string }> = {
  sleep: { label: "Where to sleep", emoji: "🛏️", question: "Where to stay" },
  food: { label: "Where to eat", emoji: "🍜", question: "Where to eat" },
  fun: { label: "Where to have fun", emoji: "🎉", question: "What to do" },
  work: { label: "Where to work", emoji: "📶", question: "Where to work" },
  community: { label: "Where to meet people", emoji: "🤝", question: "Where to meet people" },
};

export const TIP_KIND_META: Record<TipKind, { label: string; emoji: string }> = {
  facebook_group: { label: "Facebook group", emoji: "👥" },
  whatsapp_group: { label: "WhatsApp group", emoji: "💬" },
  discount: { label: "Discount", emoji: "🏷️" },
  long_term: { label: "Long-term deal", emoji: "📅" },
  advice: { label: "Local advice", emoji: "💡" },
};

/** A place is recommended for a profile when enough people of that profile rated it well. */
export const RECOMMEND_MIN_VOTES = 3;
export const RECOMMEND_MIN_AVG = 4;

export function isProfileId(v: unknown): v is ProfileId {
  return typeof v === "string" && v in PROFILES;
}

export { PROFILE_IDS } from "@/lib/db/schema";
