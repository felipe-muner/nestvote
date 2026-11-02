import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/logo";

const NAV = [
  { href: "/cities", label: "Cities" },
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why" },
];

/** Floating glass pill over the dark home page. */
export function HomeNav() {
  return (
    <header className="sticky top-0 z-50 h-0">
      <div className="px-3 pt-3 sm:px-5 sm:pt-4">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-white/10 bg-[#061109]/70 py-1.5 pl-4 pr-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:pl-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="NestVote home">
            <LogoMark size={24} nest="#F59E0B" check="#34D399" />
            <span className="font-heading text-[17px] font-semibold tracking-tight text-white">NestVote</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 lg:inline">/ voted by people like you</span>
          </Link>
          <div className="hidden items-center md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/submit"
            className="group inline-flex h-10 items-center gap-2 rounded-full bg-white pl-4 pr-1.5 text-sm font-medium text-[#061109] transition hover:shadow-[0_0_30px_-6px_rgba(52,211,153,0.8)]"
          >
            Add a place
            <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-white transition-transform duration-300 group-hover:-rotate-45">
              <ArrowRight className="size-3.5" />
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
