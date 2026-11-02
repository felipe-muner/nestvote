import { ImageResponse } from "next/og";
import { ShareCard } from "@/components/share-card";

export const alt = "NestVote";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <ShareCard
        eyebrow="Places voted by people who travel like you"
        title="Stop researching what someone like you already confirmed."
        subtitle="Digital nomads, volunteers, lush travelers and expats each get their own votes."
        stats={null}
        footer="nestvote.vercel.app"
      />
    ),
    size,
  );
}
