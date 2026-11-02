# Roadmap

NestVote is young. This is the work ahead, roughly in order. GitHub issues track each item.

## Make the votes trustworthy

- [ ] Weight votes by stay length: a nomad who stayed 60 days counts more than a 3-day visit.
- [ ] Verified stays: optional proof (booking, host confirmation) that marks a vote as verified.
- [ ] Flag and moderation flow for places and tips; rate limits on new accounts.
- [ ] Vote decay: ratings older than two years fade so recommendations stay current.

## Make it useful on day one

- [ ] City search and country pages; "near me" from the browser location.
- [ ] Cost snapshot per city and profile: median monthly cost from the votes.
- [ ] Place photos (user uploads with moderation) and a map view per city.
- [ ] Import public datasets of coworkings and hostels as unrated places to vote on.

## Expat inside track

- [ ] Tip expiry and "still valid?" check-ins so group links and discounts stay fresh.
- [ ] Discount codes with a claim counter, so the community sees what still works.
- [ ] Long-term housing board: monthly prices reported by people who actually rent.

## Growth

- [ ] Share cards: "Recommended by 12 volunteers" image for Instagram and WhatsApp.
- [ ] Email digest per city and profile for people who follow a city.
- [ ] Multilingual UI (Portuguese, Spanish, Thai first).

## Engineering

- [ ] GitHub Actions CI: lint, typecheck, build, seed against a Postgres service.
- [ ] Unit tests for the recommendation rule and ranking; Playwright smoke for vote flow.
- [ ] Rate limiting and bot protection on write actions.
- [ ] Observability: structured logs and error tracking on server actions.
