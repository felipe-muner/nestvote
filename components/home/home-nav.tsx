import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions";
import { LogoMark } from "@/components/logo";
import { NavLinks } from "@/components/home/nav-links";


/** Floating glass pill used on every page. */
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
            <NavLinks />
          </div>
          <div className="flex items-center gap-1">
            <Suspense fallback={<span className="hidden h-8 w-16 rounded-full bg-white/[0.06] sm:block" />}>
              <NavAuth />
            </Suspense>
            <Link
              href="/submit"
              className="group inline-flex h-10 items-center gap-2 rounded-full bg-white pl-4 pr-1.5 text-sm font-medium text-[#061109] transition hover:shadow-[0_0_30px_-6px_rgba(52,211,153,0.8)]"
            >
              Add a place
              <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-white transition-transform duration-300 group-hover:-rotate-45">
                <ArrowRight className="size-3.5" />
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

async function NavAuth() {
  await connection();
  const session = await auth();
  if (!session?.user) {
    return (
      <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white sm:inline-block">
        Sign in
      </Link>
    );
  }
  return (
    <form action={signOutAction} className="hidden items-center gap-2 sm:flex">
      <span className="max-w-[10rem] truncate text-sm text-white/60">{session.user.name ?? session.user.email}</span>
      <button type="submit" className="rounded-full px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white">
        Sign out
      </button>
    </form>
  );
}
