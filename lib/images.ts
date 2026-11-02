/**
 * Cover images. One place to swap placeholders for real photography.
 * Until real photos land in public/img, covers come from Lorem Picsum by fixed photo id,
 * chosen to read as landscapes and places rather than random objects.
 */
const PICSUM_ID: Record<string, number> = {
  hero: 1015,
  "koh-phangan": 1011,
  "chiang-mai": 1018,
  lisbon: 1040,
  canggu: 1036,
  medellin: 1016,
};
const LOCAL: Record<string, string> = {
  // "koh-phangan": "/img/cities/koh-phangan.jpg",
};

export function coverFor(key: string, width = 1600, height = 1000): string {
  if (LOCAL[key]) return LOCAL[key];
  const id = PICSUM_ID[key];
  return id ? `https://picsum.photos/id/${id}/${width}/${height}` : `https://picsum.photos/seed/nestvote-${key}/${width}/${height}`;
}

export const HERO_IMAGE = coverFor("hero", 1600, 1200);
