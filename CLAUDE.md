# NestVote

Travel places voted per traveler profile (nomad, volunteer, luxury, expat). See README.md.

## Working rules

- Next.js 16 with Cache Components: every database read lives inside a `<Suspense>` boundary
  (see `app/[city]/page.tsx` for the pattern). Read `node_modules/next/dist/docs/` before using
  an API you are not sure about; this version differs from older training data.
- Data model and the recommendation rule are the product. Change `lib/db/schema.ts`,
  `lib/profiles.ts` and `lib/queries.ts` deliberately, and keep "one vote per user, per place,
  per profile" intact.
- Server actions in `lib/actions.ts` validate with zod and require a session. Never trust form
  input.
- Sample data lives only in `scripts/seed.ts` and is marked `is_sample`. Never commit real
  people, real phone numbers or real group links as seed data.
- `pnpm typecheck && pnpm lint && pnpm build` must pass before committing.
