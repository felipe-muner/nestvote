import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { coverFor } from "@/lib/images";
import { getCities } from "@/lib/queries";

/** Horizontal rail of city cards on the dark home page. */
export async function CityRail() {
  const rows = await getCities();
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex w-max gap-4">
        {rows.map(({ city, placeCount, voteCount }, i) => (
          <li key={city.id} className="w-[300px] shrink-0 sm:w-[340px]">
            <Link href={`/${city.slug}`} className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-2 transition-colors duration-500 hover:border-white/25">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] ring-1 ring-white/10">
                <Image src={coverFor(city.slug, 900, 675)} alt={`${city.name}, ${city.country}`} fill sizes="340px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061109]/85 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/85 backdrop-blur">
                  {String(i + 1).padStart(2, "0")} · {city.country}
                </span>
                <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
                  <span className="font-heading text-2xl text-white">{city.name}</span>
                  <ArrowUpRight className="size-5 text-white/60 transition-colors group-hover:text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between px-3 pb-2 pt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/45">
                <span>{placeCount} places</span>
                <span>{voteCount} votes</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
