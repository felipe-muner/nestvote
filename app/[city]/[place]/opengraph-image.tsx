import { ImageResponse } from "next/og";
import { ShareCard } from "@/components/share-card";
import { CATEGORIES } from "@/lib/profiles";
import { getPlace } from "@/lib/queries";

export const alt = "NestVote place card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ city: string; place: string }> }) {
  const { city, place: placeSlug } = await params;
  const place = await getPlace(city, placeSlug);
  if (!place) {
    return new ImageResponse(<ShareCard eyebrow="NestVote" title="Not on the map yet" stats={null} footer="nestvote.vercel.app" />, size);
  }
  const cat = CATEGORIES[place.category];
  return new ImageResponse(
    (
      <ShareCard
        eyebrow={`${place.city.name}, ${place.city.country} · ${cat.label}`}
        title={place.name}
        subtitle={place.description}
        stats={place.stats}
        footer="nestvote.vercel.app"
      />
    ),
    size,
  );
}
