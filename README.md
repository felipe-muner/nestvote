# NestVote

**Live:** https://nestvote.vercel.app · **Code:** https://github.com/felipe-muner/nestvote

Where to sleep, eat, work and have fun, voted by people who travel like you.

A digital nomad, a volunteer, a lush traveler and an expat need different things from the
same city. Every other travel site mixes their opinions into one star rating. NestVote keeps
them apart: a place can be "5 stars from 10 volunteers" and "2 stars from 4 lush travelers"
at the same time, and both are true.

## Why this exists

Since 2018 I have been living abroad, and the biggest time investment of that life is
making sure the place I am going to is really trustworthy. First as a volunteer, exchanging
my time for accommodation, food and experience, and needing to know the host was real. Then
as a coder in cafés, needing to be sure the wifi really holds and the food is actually good.
Or simply knowing the best time to show up when the party runs from Saturday 10pm until
Monday 6am.

Every time, hundreds of people before me already knew the answer, and I had to find it again
from scratch. NestVote is a place where people upvote places and we trust them by their
profile on the platform, and where the people who have been living somewhere for a while
share the hidden secrets for the best experience possible.

## How it works

1. **Vote as who you were.** You rate a place as a nomad, volunteer, lush traveler or expat.
   One vote per person, per profile, per place; re-voting updates your vote.
2. **Enough votes make a recommendation.** A place is recommended for a profile when at least
   3 people of that profile rated it and the weighted average is 4 stars or more. Votes are
   weighted by stay length (1 + ln(1 + days), capped at 6), so two months count more than a
   weekend but never more than six weekends. No single opinion decides.
3. **Expats share the inside track.** Facebook and WhatsApp groups, long-term rates, discounts
   and advice that a tourist on a three-day trip never hears about, with a "helpful" vote.

## Profiles

| Profile | What they need |
|---|---|
| 💻 Digital nomad | Work spots with real wifi, a bed for a month, good food, people, a reason to stay |
| 🌱 Volunteer | Places that give bed and food for help, free or near-free fun, community |
| 🥂 Lush traveler | Where the money is actually worth it, according to people who paid |
| 🏡 Expat | The groups, the long-term deals, the discounts, the places locals use |

## Tech stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · Drizzle ORM + PostgreSQL (Neon in production) · Auth.js v5 with Google ·
deployed on Vercel at nestvote.vercel.app.

## Tests

```bash
pnpm test        # vitest: recommendation rule, weighting, ranking
pnpm typecheck
pnpm lint
```

CI runs lint, typecheck, tests and the production build on every push and pull request.

## Run it locally

```bash
git clone https://github.com/felipe-muner/nestvote
cd nestvote
pnpm install
cp .env.example .env.local        # set AUTH_SECRET (openssl rand -base64 32)
docker compose up -d              # local Postgres on port 5433
pnpm db:push                      # create the schema
pnpm db:seed                      # five sample cities with fictional places and votes
pnpm dev                          # http://localhost:3000
```

Sign-in is name-only for now (no password, no email): pick a name and vote. Google OAuth is wired in `lib/auth.ts` and switches on automatically if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.

## Project map

| Area | Where |
|---|---|
| Database schema (profiles, cities, places, reviews, tips, votes) | `lib/db/schema.ts` |
| Queries and the recommendation rule | `lib/queries.ts`, `lib/profiles.ts` |
| Server actions (vote, add place, share tip, helpful) | `lib/actions.ts` |
| Pages: home, cities, city board, place, insider tips, add place, login | `app/` |
| Forms and cards | `components/` |
| Seed data (fictional) | `scripts/seed.ts` |

## Sample data

The seed script creates five cities with fictional places, reviewers and tips so the product
is understandable on first load. Everything it creates is marked `is_sample` and is meant to
be replaced by real votes.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) and the GitHub issues.

## License

[MIT](./LICENSE).
