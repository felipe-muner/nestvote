import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { City } from "@/lib/db/schema";
import { coverFor } from "@/lib/images";

export function CityCard({
  city,
  placeCount,
  voteCount,
  href,
}: {
  city: City;
  placeCount: number;
  voteCount: number;
  href: string;
}) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3]">
        <Image
          src={coverFor(city.slug, 1200, 900)}
          alt={`${city.name}, ${city.country}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-white/80">
            <MapPin className="size-3.5" /> {city.country}
          </p>
          <h3 className="text-2xl font-semibold leading-tight">{city.name}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
        <span>{placeCount} places</span>
        <span>{voteCount} votes</span>
      </div>
    </Link>
  );
}
