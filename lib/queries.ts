import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities, places, reviews, tips, users, type City, type Place, type ProfileId } from "@/lib/db/schema";
import { PROFILE_IDS } from "@/lib/profiles";
import { emptyStats, median, summarizeByProfile, type ProfileStat } from "@/lib/recommend";

export { rankForProfile } from "@/lib/recommend";
export type { ProfileStat };
export type PlaceWithStats = Place & { stats: Record<ProfileId, ProfileStat>; totalVotes: number };

export async function getCities(q?: string) {
  const query = q?.trim();
  return db
    .select({
      city: cities,
      placeCount: count(places.id),
      voteCount: sql<number>`(select count(*) from ${reviews} r join ${places} p on p.id = r.place_id where p.city_id = ${cities.id})`.mapWith(Number),
    })
    .from(cities)
    .leftJoin(places, eq(places.cityId, cities.id))
    .where(query ? or(ilike(cities.name, `%${query}%`), ilike(cities.country, `%${query}%`)) : undefined)
    .groupBy(cities.id)
    .orderBy(cities.name);
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const [city] = await db.select().from(cities).where(eq(cities.slug, slug)).limit(1);
  return city;
}

/** Load every vote for the given places and summarize per place and profile. */
async function attachStats(rows: Place[]): Promise<PlaceWithStats[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((p) => p.id);
  const votes = await db
    .select({
      placeId: reviews.placeId,
      profile: reviews.profile,
      rating: reviews.rating,
      stayDays: reviews.stayDays,
      monthlyCostUsd: reviews.monthlyCostUsd,
    })
    .from(reviews)
    .where(sql`${reviews.placeId} in ${ids}`);

  const byPlace = new Map<string, typeof votes>();
  for (const v of votes) {
    const list = byPlace.get(v.placeId) ?? [];
    list.push(v);
    byPlace.set(v.placeId, list);
  }
  return rows.map((p) => {
    const list = byPlace.get(p.id);
    const stats = list ? summarizeByProfile(list) : emptyStats();
    const totalVotes = PROFILE_IDS.reduce((n, id) => n + stats[id].votes, 0);
    return { ...p, stats, totalVotes };
  });
}

/** Every place in a city with its per-profile ratings. */
export async function getCityBoard(cityId: string): Promise<PlaceWithStats[]> {
  const rows = await db.select().from(places).where(eq(places.cityId, cityId)).orderBy(places.name);
  return attachStats(rows);
}

export type CostSnapshot = Record<ProfileId, { medianMonthlyCostUsd: number | null; reports: number }>;

/** What each profile reports paying per month for a place to sleep in this city. */
export async function getCityCostSnapshot(cityId: string): Promise<CostSnapshot> {
  const rows = await db
    .select({ profile: reviews.profile, cost: reviews.monthlyCostUsd })
    .from(reviews)
    .innerJoin(places, eq(places.id, reviews.placeId))
    .where(and(eq(places.cityId, cityId), eq(places.category, "sleep"), sql`${reviews.monthlyCostUsd} is not null`));
  const out = Object.fromEntries(PROFILE_IDS.map((p) => [p, { medianMonthlyCostUsd: null, reports: 0 }])) as CostSnapshot;
  for (const p of PROFILE_IDS) {
    const costs = rows.filter((r) => r.profile === p).map((r) => r.cost as number);
    out[p] = { medianMonthlyCostUsd: median(costs), reports: costs.length };
  }
  return out;
}

export async function getPlace(citySlug: string, placeSlug: string) {
  const [row] = await db
    .select({ place: places, city: cities })
    .from(places)
    .innerJoin(cities, eq(cities.id, places.cityId))
    .where(and(eq(cities.slug, citySlug), eq(places.slug, placeSlug)))
    .limit(1);
  if (!row) return undefined;
  const [withStats] = await attachStats([row.place]);
  const placeReviews = await db
    .select({
      id: reviews.id,
      profile: reviews.profile,
      rating: reviews.rating,
      body: reviews.body,
      stayDays: reviews.stayDays,
      monthlyCostUsd: reviews.monthlyCostUsd,
      visitedYear: reviews.visitedYear,
      createdAt: reviews.createdAt,
      userName: users.name,
      userImage: users.image,
    })
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.userId))
    .where(eq(reviews.placeId, row.place.id))
    .orderBy(desc(reviews.createdAt));
  return { ...withStats, city: row.city, reviews: placeReviews };
}

export async function getTips(cityId: string) {
  return db
    .select({
      tip: tips,
      userName: users.name,
    })
    .from(tips)
    .leftJoin(users, eq(users.id, tips.userId))
    .where(eq(tips.cityId, cityId))
    .orderBy(desc(tips.helpfulCount), desc(tips.createdAt));
}
