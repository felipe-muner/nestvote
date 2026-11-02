import type { ProfileId } from "@/lib/db/schema";
import { PROFILE_IDS, RECOMMEND_MIN_AVG, RECOMMEND_MIN_VOTES } from "@/lib/profiles";

/**
 * The recommendation rule, as pure functions so it can be unit-tested and
 * explained on the site:
 *
 * - Every vote is given as a profile (nomad, volunteer, luxury, expat).
 * - A vote is weighted by how long the person stayed: 1 + ln(1 + days), capped at 6.
 *   Someone who lived a place for two months outweighs a weekend, but never 10 weekends.
 * - A place is recommended for a profile when at least RECOMMEND_MIN_VOTES people of
 *   that profile voted and the weighted average is RECOMMEND_MIN_AVG or more.
 */

export type ProfileStat = {
  profile: ProfileId;
  /** Weighted average rating, 0 when nobody voted. */
  avg: number;
  votes: number;
  recommended: boolean;
  /** Median monthly cost reported by this profile, in USD; null when nobody reported one. */
  medianMonthlyCostUsd: number | null;
  costReports: number;
};

export type VoteLike = { rating: number; stayDays?: number | null; monthlyCostUsd?: number | null };

export const MAX_STAY_WEIGHT = 6;

export function stayWeight(stayDays: number | null | undefined): number {
  const days = Math.max(0, stayDays ?? 0);
  return Math.min(MAX_STAY_WEIGHT, 1 + Math.log(1 + days));
}

export function weightedAverage(votes: VoteLike[]): number {
  if (votes.length === 0) return 0;
  let num = 0;
  let den = 0;
  for (const v of votes) {
    const w = stayWeight(v.stayDays);
    num += v.rating * w;
    den += w;
  }
  return Math.round((num / den) * 10) / 10;
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export function isRecommended(avg: number, votes: number): boolean {
  return votes >= RECOMMEND_MIN_VOTES && avg >= RECOMMEND_MIN_AVG;
}

export function emptyStat(profile: ProfileId): ProfileStat {
  return { profile, avg: 0, votes: 0, recommended: false, medianMonthlyCostUsd: null, costReports: 0 };
}

export function emptyStats(): Record<ProfileId, ProfileStat> {
  return Object.fromEntries(PROFILE_IDS.map((p) => [p, emptyStat(p)])) as Record<ProfileId, ProfileStat>;
}

/** Summarize one profile's votes for one place. */
export function summarize(profile: ProfileId, votes: VoteLike[]): ProfileStat {
  if (votes.length === 0) return emptyStat(profile);
  const avg = weightedAverage(votes);
  const costs = votes.map((v) => v.monthlyCostUsd).filter((c): c is number => typeof c === "number" && c >= 0);
  return {
    profile,
    avg,
    votes: votes.length,
    recommended: isRecommended(avg, votes.length),
    medianMonthlyCostUsd: median(costs),
    costReports: costs.length,
  };
}

/** Group raw votes by profile and summarize each. */
export function summarizeByProfile(votes: (VoteLike & { profile: ProfileId })[]): Record<ProfileId, ProfileStat> {
  const stats = emptyStats();
  for (const p of PROFILE_IDS) {
    stats[p] = summarize(
      p,
      votes.filter((v) => v.profile === p),
    );
  }
  return stats;
}

export type Rankable = { name: string; stats: Record<ProfileId, ProfileStat> };

/** Sort for one profile: recommended first, then average, then number of votes, then name. */
export function rankForProfile<T extends Rankable>(list: T[], profile: ProfileId): T[] {
  return [...list].sort((a, b) => {
    const sa = a.stats[profile];
    const sb = b.stats[profile];
    if (sa.recommended !== sb.recommended) return sa.recommended ? -1 : 1;
    if (sb.avg !== sa.avg) return sb.avg - sa.avg;
    if (sb.votes !== sa.votes) return sb.votes - sa.votes;
    return a.name.localeCompare(b.name);
  });
}
