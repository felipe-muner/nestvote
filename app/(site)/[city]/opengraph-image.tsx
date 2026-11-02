import { ImageResponse } from "next/og";
import { ShareCard } from "@/components/share-card";
import { PROFILES, PROFILE_IDS } from "@/lib/profiles";
import { getCityBoard, getCityBySlug } from "@/lib/queries";

export const alt = "NestVote city card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = await getCityBySlug(slug);
  if (!city) {
    return new ImageResponse(<ShareCard eyebrow="NestVote" title="Not on the map yet" stats={null} footer="nestvote.vercel.app" />, size);
  }
  const board = await getCityBoard(city.id);
  const recommended = PROFILE_IDS.map((p) => `${PROFILES[p].emoji} ${board.filter((b) => b.stats[p].recommended).length} for ${PROFILES[p].plural}`).join("   ");
  return new ImageResponse(
    (
      <ShareCard
        eyebrow={city.country}
        title={city.name}
        subtitle={`${board.length} places · ${recommended}`}
        stats={null}
        footer="nestvote.vercel.app"
      />
    ),
    size,
  );
}
