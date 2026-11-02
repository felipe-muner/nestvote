/**
 * Cover images. One place to swap placeholders for real photography.
 * Keys are city slugs; "hero" is the home page. Until real images land in public/img,
 * covers come from Lorem Picsum (free placeholder photos, deterministic by seed).
 */
const LOCAL: Record<string, string> = {
  // "koh-phangan": "/img/cities/koh-phangan.jpg",
};

export function coverFor(key: string, width = 1600, height = 1000): string {
  if (LOCAL[key]) return LOCAL[key];
  return `https://picsum.photos/seed/nestvote-${key}/${width}/${height}`;
}

export const HERO_IMAGE = coverFor("hero", 2000, 1200);
