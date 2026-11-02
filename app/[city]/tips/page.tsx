import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink, ThumbsUp } from "lucide-react";
import { voteTip } from "@/lib/actions";
import { PROFILES, TIP_KIND_META, isProfileId } from "@/lib/profiles";
import { getCityBySlug, getTips } from "@/lib/queries";
import { ProfileBadge } from "@/components/profile-badge";
import { ProfileTabs } from "@/components/profile-tabs";
import { TipForm } from "@/components/tip-form";
import { Button } from "@/components/ui/button";

export default function TipsPage(props: PageProps<"/[city]/tips">) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border bg-muted/40" />}>
      <Tips params={props.params} searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Tips({ params, searchParams }: Pick<PageProps<"/[city]/tips">, "params" | "searchParams">) {
  const [{ city: citySlug }, sp] = await Promise.all([params, searchParams]);
  const city = await getCityBySlug(citySlug);
  if (!city) notFound();
  const profile = isProfileId(sp.profile) ? sp.profile : "expat";
  const rows = await getTips(city.id);
  const mine = rows.filter((r) => r.tip.profile === profile);
  const others = rows.filter((r) => r.tip.profile !== profile);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link className="underline" href={`/${city.slug}?profile=${profile}`}>
            {city.name}
          </Link>{" "}
          · insider tips
        </p>
        <h1 className="text-3xl font-bold tracking-tight">The inside track in {city.name}</h1>
        <p className="max-w-2xl text-muted-foreground">
          Groups to join, long-term prices, discounts and advice that people who live here share so you do not pay the
          three-day-tourist rate.
        </p>
        <ProfileTabs basePath={`/${city.slug}/tips`} active={profile} />
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">For {PROFILES[profile].plural}</h2>
        {mine.length === 0 ? <p className="text-sm text-muted-foreground">No tips for {PROFILES[profile].plural} yet. Share the first one below.</p> : null}
        <ul className="space-y-3">
          {mine.map(({ tip, userName }) => (
            <TipItem key={tip.id} tip={tip} userName={userName} citySlug={city.slug} />
          ))}
        </ul>
      </section>

      {others.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Shared by other profiles</h2>
          <ul className="space-y-3">
            {others.map(({ tip, userName }) => (
              <TipItem key={tip.id} tip={tip} userName={userName} citySlug={city.slug} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Share a tip</h2>
        <TipForm citySlug={city.slug} />
      </section>
    </div>
  );
}

function TipItem({
  tip,
  userName,
  citySlug,
}: {
  tip: { id: string; profile: "nomad" | "volunteer" | "luxury" | "expat"; kind: keyof typeof TIP_KIND_META; title: string; body: string | null; url: string | null; helpfulCount: number };
  userName: string | null;
  citySlug: string;
}) {
  const kind = TIP_KIND_META[tip.kind];
  return (
    <li className="rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>
          {kind.emoji} {kind.label}
        </span>
        <ProfileBadge profile={tip.profile} />
        {userName ? <span>by {userName}</span> : null}
      </div>
      <h3 className="mt-1 font-semibold">{tip.title}</h3>
      {tip.body ? <p className="mt-1 text-sm text-muted-foreground">{tip.body}</p> : null}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {tip.url ? (
          <a className="inline-flex items-center gap-1 text-sm underline" href={tip.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" /> Open link
          </a>
        ) : null}
        <form action={voteTip.bind(null, tip.id, citySlug)}>
          <Button type="submit" size="sm" variant="outline">
            <ThumbsUp className="size-4" /> Helpful · {tip.helpfulCount}
          </Button>
        </form>
      </div>
    </li>
  );
}
