import { describe, expect, it } from "vitest";
import { emptyStats, isRecommended, median, rankForProfile, stayWeight, summarize, summarizeByProfile, weightedAverage } from "@/lib/recommend";

describe("stayWeight", () => {
  it("gives an unknown or zero-day stay a weight of 1", () => {
    expect(stayWeight(null)).toBe(1);
    expect(stayWeight(0)).toBe(1);
  });
  it("grows with stay length but is capped", () => {
    expect(stayWeight(3)).toBeGreaterThan(stayWeight(1));
    expect(stayWeight(60)).toBeGreaterThan(stayWeight(3));
    expect(stayWeight(100000)).toBe(6);
  });
});

describe("weightedAverage", () => {
  it("is 0 with no votes", () => {
    expect(weightedAverage([])).toBe(0);
  });
  it("equals the plain mean when nobody reported a stay", () => {
    expect(weightedAverage([{ rating: 5 }, { rating: 3 }])).toBe(4);
  });
  it("leans toward the longer stay", () => {
    const avg = weightedAverage([
      { rating: 5, stayDays: 60 },
      { rating: 1, stayDays: 1 },
    ]);
    expect(avg).toBeGreaterThan(3);
  });
});

describe("median", () => {
  it("handles empty, odd and even lists", () => {
    expect(median([])).toBeNull();
    expect(median([300, 100, 200])).toBe(200);
    expect(median([100, 400])).toBe(250);
  });
});

describe("recommendation rule", () => {
  it("needs at least 3 votes and a 4.0 average", () => {
    expect(isRecommended(4.5, 2)).toBe(false);
    expect(isRecommended(3.9, 10)).toBe(false);
    expect(isRecommended(4.0, 3)).toBe(true);
  });

  it("keeps profiles apart", () => {
    const stats = summarizeByProfile([
      { profile: "volunteer", rating: 5 },
      { profile: "volunteer", rating: 5 },
      { profile: "volunteer", rating: 4 },
      { profile: "luxury", rating: 2 },
      { profile: "luxury", rating: 1 },
      { profile: "luxury", rating: 2 },
    ]);
    expect(stats.volunteer.recommended).toBe(true);
    expect(stats.volunteer.votes).toBe(3);
    expect(stats.luxury.recommended).toBe(false);
    expect(stats.luxury.avg).toBeCloseTo(1.7, 1);
    expect(stats.nomad.votes).toBe(0);
  });

  it("reports the median monthly cost", () => {
    const s = summarize("nomad", [
      { rating: 4, monthlyCostUsd: 400 },
      { rating: 5, monthlyCostUsd: 600 },
      { rating: 4 },
    ]);
    expect(s.medianMonthlyCostUsd).toBe(500);
    expect(s.costReports).toBe(2);
  });
});

describe("rankForProfile", () => {
  const mk = (name: string, avg: number, votes: number) => {
    const stats = emptyStats();
    stats.nomad = { profile: "nomad", avg, votes, recommended: isRecommended(avg, votes), medianMonthlyCostUsd: null, costReports: 0 };
    return { name, stats };
  };

  it("puts recommended places first, then by average, then by votes, then by name", () => {
    const ranked = rankForProfile([mk("Zeta", 4.8, 2), mk("Alpha", 4.2, 5), mk("Beta", 4.2, 9), mk("Gamma", 4.9, 3)], "nomad");
    expect(ranked.map((r) => r.name)).toEqual(["Gamma", "Beta", "Alpha", "Zeta"]);
  });

  it("does not mutate the input", () => {
    const input = [mk("B", 3, 1), mk("A", 5, 5)];
    rankForProfile(input, "nomad");
    expect(input[0].name).toBe("B");
  });
});
