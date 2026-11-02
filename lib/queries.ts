import { and, avg, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cities, places, reviews, tips, users, type City, type Place, type ProfileId } from "@/lib/db/schema";
import { PROFILE_IDS, RECOMMEND_MIN_AVG, RECOMMEND_MIN_VOTES } from "@/lib/profiles";

export type ProfileStat = { profile: ProfileId; avg: number; votes: number; recommended: boolean };
export type PlaceWithStats = Place & { stats: Record<ProfileId, ProfileStat>; totalVotes: number };

function emptyStats(): Record<ProfileId, ProfileStat> {
  return Object.fromEntries(
    PROFILE_IDS.map((p) => [p, { profile: p, avg: 0, votes: 0, recommended: false }]),
  ) as Record<ProfileId, ProfileStat>;
}

export async function getCities() {
  return db
    .select({
      city: cities,
      placeCount: count(places.id),
      voteCount: sql<number>`(select count(*) from ${reviews} r join ${places} p on p.id = r.place_id where p.city_id = ${cities.id})`.mapWith(Number),
    })
    .from(cities)
    .leftJoin(places, eq(places.cityId, cities.id))
    .groupBy(cities.id)
    .orderBy(cities.name);
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const [city] = await db.select().from(cities).where(eq(cities.slug, slug)).limit(1);
  return city;
}

async function attachStats(rows: Place[]): Promise<PlaceWithStats[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((p) => p.id);
  const agg = await db
    .select({
      placeId: reviews.placeId,
      profile: reviews.profile,
      avg: avg(reviews.rating).mapWith(Number),
      votes: count(reviews.id),
    })
    .from(reviews)
    .where(sql`${reviews.placeId} in ${ids}`)
    .groupBy(reviews.placeId, reviews.profile);

  const byPlace = new Map<string, Record<ProfileId, ProfileStat>>();
  for (const a of agg) {
    const stats = byPlace.get(a.placeId) ?? emptyStats();
    const avgRounded = Math.round(a.avg * 10) / 10;
    stats[a.profile] = {
      profile: a.profile,
      avg: avgRounded,
      votes: a.votes,
      recommended: a.votes >= RECOMMEND_MIN_VOTES && avgRounded >= RECOMMEND_MIN_AVG,
    };
    byPlace.set(a.placeId, stats);
  }
  return rows.map((p) => {
    const stats = byPlace.get(p.id) ?? emptyStats();
    const totalVotes = PROFILE_IDS.reduce((n, id) => n + stats[id].votes, 0);
    return { ...p, stats, totalVotes };
  });
}

/** Every place in a city with its per-profile ratings. */
export async function getCityBoard(cityId: string): Promise<PlaceWithStats[]> {
  const rows = await db.select().from(places).where(eq(places.cityId, cityId)).orderBy(places.name);
  return attachStats(rows);
}

/** Sort places for one profile: recommended first, then average, then number of votes. */
export function rankForProfile(list: PlaceWithStats[], profile: ProfileId): PlaceWithStats[] {
  return [...list].sort((a, b) => {
    const sa = a.stats[profile];
    const sb = b.stats[profile];
    if (sa.recommended !== sb.recommended) return sa.recommended ? -1 : 1;
    if (sb.avg !== sa.avg) return sb.avg - sa.avg;
    if (sb.votes !== sa.votes) return sb.votes - sa.votes;
    return a.name.localeCompare(b.name);
  });
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
