import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { PROFILE_LIST } from "@/lib/profiles";
import { getHomeStats } from "@/lib/queries";
import { CityRail } from "@/components/home/city-rail";
import { HeroStage } from "@/components/home/hero-stage";
import { HomeNav } from "@/components/home/home-nav";
import { LenisScroll } from "@/components/lenis-scroll";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

const HERO_PROFILES = PROFILE_LIST.map((p) => ({
  id: p.id,
  label: p.label,
  emoji: p.emoji,
  blurb: { nomad: "wifi · bed · month", volunteer: "bed & food for help", luxury: "worth the money", expat: "groups · long-term" }[p.id],
}));

const STEPS = [
  { n: "01", who: "you", title: "Vote as who you were", text: "Rate a place as a nomad, volunteer, lush traveler or expat. One vote per person, per profile, per place. Say how long you stayed and what it cost." },
  { n: "02", who: "everyone", title: "Enough votes confirm it", text: "Three or more people of a profile averaging four stars make a place recommended for that profile. Long stays weigh more than weekends." },
  { n: "03", who: "expats", title: "The inside track", text: "Facebook and WhatsApp groups, monthly rates, discounts and advice from people who live there, so you never pay the three-day-tourist price." },
] as const;

const FAQ = [
  { q: "Why keep the profiles apart?", a: "Because a hostel that is perfect for a volunteer is a bad night for a lush traveler, and both are telling the truth. One star rating hides that. Four do not." },
  { q: "What makes a place recommended?", a: "At least three votes from the same profile with a weighted average of four stars or more. One opinion never decides, and a two-month stay counts more than a weekend." },
  { q: "Do I need an account?", a: "Pick a name and vote. No password, no email. Use the same name next time and your votes stay yours." },
  { q: "Is the sample data real?", a: "Not yet. The five seeded cities carry fictional places and votes so you can see how it works. Real votes replace them as people arrive." },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-300/90">{children}</span>;
}

export default function HomePage() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#061109] text-[#eef6f0] antialiased selection:bg-emerald-500/40">
      <LenisScroll />
      <HomeNav />

      {/* Hero */}
      <section className="relative isolate flex flex-col overflow-hidden lg:min-h-[max(100svh,780px)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(60%_55%_at_65%_45%,black,transparent)]"
        />
        <div aria-hidden className="pointer-events-none absolute -left-48 -top-48 -z-10 size-[44rem] rounded-full bg-amber-500/[0.10] blur-[120px]" />

        <HeroStage profiles={HERO_PROFILES} />

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-5 pb-16 sm:px-8 lg:px-12 lg:pb-14 lg:pt-32">
          <div className="max-w-[40rem] lg:my-auto lg:max-w-[47%]">
            <Reveal>
              <Suspense fallback={<Pill>Loading the map…</Pill>}>
                <LivePill />
              </Suspense>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-7 font-sans text-[2.9rem] font-light leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[clamp(3.4rem,5vw,5.4rem)]">
                Stop researching
                <br />
                <span className="bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text pr-[0.12em] font-heading text-[1.08em] italic tracking-[-0.02em] text-transparent">
                  what someone like you already confirmed.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-white/60 sm:text-lg">
                A digital nomad, a volunteer, a lush traveler and an expat need different things from the same city. NestVote keeps
                their votes apart, so &ldquo;5 stars from 10 volunteers&rdquo; means exactly that.
              </p>
            </Reveal>
            <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/cities"
                className="group inline-flex h-[52px] items-center gap-3 rounded-full bg-white pl-1.5 pr-6 text-[15px] font-medium text-[#061109] shadow-[0_12px_44px_-12px_rgba(52,211,153,0.75)] transition hover:-translate-y-0.5"
              >
                <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white transition-transform duration-300 group-hover:-rotate-45">
                  <ArrowRight className="size-4" />
                </span>
                Pick a city
              </Link>
              <Link
                href="/submit"
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white"
              >
                Add a place <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={320} className="mt-14 max-w-[40rem] lg:mt-0 lg:max-w-[47%]">
            <Suspense fallback={<StatsSkeleton />}>
              <Stats />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-viewport relative overflow-hidden border-y border-white/[0.06] bg-white/[0.012] py-5 [--marquee-duration:70s] [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
              {["Where to sleep", "Where to eat", "Where to work", "Where to have fun", "Where to meet people", "Groups to join", "Monthly rates", "Discounts locals get", "Voted by nomads", "Voted by volunteers", "Voted by lush travelers", "Voted by expats"].map((t) => (
                <li key={t} className="flex items-center whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
                  <span className="px-7">{t}</span>
                  <span aria-hidden className="text-amber-400">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Cities */}
      <section id="cities" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Cities</Eyebrow>
              <h2 className="mt-5 max-w-3xl text-balance font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                Pick a city. <span className="font-heading italic text-white/55">Then pick who you are.</span>
              </h2>
            </div>
            <Link href="/cities" className="inline-flex items-center gap-2 text-sm text-white/70 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
              All cities <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <Reveal delay={120} className="mt-12">
            <Suspense fallback={<div className="h-72 animate-pulse rounded-[24px] border border-white/10 bg-white/[0.03]" />}>
              <CityRail />
            </Suspense>
          </Reveal>
        </div>
      </section>

      {/* Profiles */}
      <section className="border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <Eyebrow>Four profiles</Eyebrow>
            <h2 className="mt-5 max-w-3xl text-balance font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Same city. <span className="font-heading italic text-white/55">Four different trips.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILE_LIST.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full">
                <Link href={`/cities?profile=${p.id}`} className="group flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.025] p-6 transition-colors duration-500 hover:border-emerald-400/50">
                  <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.06] text-2xl ring-1 ring-white/10" aria-hidden>
                    {p.emoji}
                  </span>
                  <h3 className="mt-6 font-heading text-2xl">{p.label}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{p.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300">
                    See their places <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24 border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-5 max-w-3xl text-balance font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                No single opinion decides. <span className="font-heading italic text-white/55">Enough of the right ones do.</span>
              </h2>
            </div>
            <p className="max-w-sm leading-relaxed text-white/55">A recommendation here is three people like you agreeing, not an algorithm and not an influencer.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90} className="h-full">
                <article className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.025] p-7 transition-colors duration-500 hover:border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-300">{step.n}</span>
                    <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{step.who}</span>
                  </div>
                  <h3 className="mt-8 font-heading text-2xl sm:text-3xl">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/55">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="scroll-mt-24 border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Eyebrow>Why this exists</Eyebrow>
            <h2 className="mt-5 text-balance font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Three years <span className="font-heading italic text-white/55">with no money.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="space-y-6 text-lg leading-relaxed text-white/65">
            <p>
              In 2018, 2019 and 2020 I volunteered around the world: sleeping and eating for free in exchange for a few hours of
              help, with almost nothing in my pocket and more life in a month than in years at a desk. Later I worked online from
              the same places.
            </p>
            <p>
              Each time I searched for the same answers hundreds of people before me had already found. Which hostel really takes
              volunteers. Which café has wifi that holds a call. Which group gets you the monthly rent instead of the tourist price.
            </p>
            <p className="text-white">
              Re-searching what previous travelers already confirmed is a waste of everyone&rsquo;s time. This is where those
              confirmations live.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Felipe Muner, founder</p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="mt-5 text-balance font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Questions, <span className="font-heading italic text-white/55">answered.</span>
            </h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details open={i === 0} className="group rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-5 transition-colors open:border-white/20 open:bg-white/[0.045]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition-transform duration-300 group-open:rotate-45">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl pr-10 leading-relaxed text-white/55">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-3 sm:px-5">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[32px] border border-white/10 bg-[#07170f] px-6 py-24 text-center sm:rounded-[44px] sm:py-36">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_110%,rgba(16,185,129,0.45),transparent_70%)]" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60 [background:repeating-radial-gradient(ellipse_120%_100%_at_50%_118%,transparent_0_46px,rgba(110,231,183,0.16)_47px,transparent_48px)] [mask-image:linear-gradient(to_top,black,transparent_75%)]"
          />
          <div className="relative">
            <Reveal>
              <Eyebrow>Your turn</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-4xl text-balance font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-7xl">
                The place that saved your trip?{" "}
                <span className="bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text pr-[0.1em] font-heading italic text-transparent">
                  Someone like you needs it.
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl leading-relaxed text-white/60">Add it, vote as the profile you were, and the next nomad, volunteer or expat skips a week of searching.</p>
            </Reveal>
            <Reveal delay={120} className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/submit"
                className="inline-flex h-[52px] items-center gap-3 rounded-full bg-white pl-1.5 pr-6 text-[15px] font-medium text-[#061109] shadow-[0_12px_44px_-12px_rgba(52,211,153,0.75)] transition hover:-translate-y-0.5"
              >
                <span className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
                  <Plus className="size-4" />
                </span>
                Add a place
              </Link>
              <Link href="/cities" className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-[15px] text-white/80 backdrop-blur transition hover:border-white/30 hover:text-white">
                Browse cities <ArrowUpRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative overflow-hidden px-5 pt-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <LogoMark size={16} nest="#F59E0B" check="#34D399" /> NestVote · open source on{" "}
            <a className="underline" href="https://github.com/felipe-muner/nestvote" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </span>
          <span>Sample cities and votes are fictional until real ones replace them.</span>
        </div>
        <div className="relative mt-10">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(55%_100%_at_50%_120%,rgba(16,185,129,0.3),transparent_70%)]" />
          <p aria-hidden className="relative -mb-[0.14em] select-none whitespace-nowrap bg-gradient-to-b from-white/80 via-white/25 to-white/0 bg-clip-text text-center font-heading text-[17vw] italic leading-none tracking-[-0.04em] text-transparent">
            NestVote
          </p>
        </div>
      </footer>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
      <span className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-emerald-400" />
      </span>
      {children}
    </span>
  );
}

async function LivePill() {
  const s = await getHomeStats();
  return (
    <Pill>
      {s.votes} votes · {s.places} places · {s.cities} cities
    </Pill>
  );
}

async function Stats() {
  const s = await getHomeStats();
  const items = [
    { v: String(s.votes), l: "Votes cast" },
    { v: String(s.places), l: "Places" },
    { v: "4", l: "Traveler profiles" },
    { v: "3+", l: "Votes to confirm" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-7 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.l} className="flex flex-col gap-1.5">
          <dt className="order-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{it.l}</dt>
          <dd className="order-1 font-sans text-3xl font-light tracking-[-0.03em] sm:text-[2.1rem]">{it.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-7 sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-12 animate-pulse rounded bg-white/[0.06]" />
      ))}
    </div>
  );
}
