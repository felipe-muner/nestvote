/**
 * Seed five cities with fictional places, reviewers, votes and tips.
 * Everything here is sample data (is_sample = true) so the product makes sense on first load.
 * Run: pnpm db:seed
 */
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { cities, places, reviews, tips, users, type CategoryId, type ProfileId, type TipKind } from "../lib/db/schema";

type SeedPlace = {
  name: string;
  category: CategoryId;
  description: string;
  priceLevel: number;
  acceptsVolunteers?: boolean;
  workFriendly?: boolean;
  /** Target rating per profile; the seeder creates `votes` reviews around it. */
  votes: Partial<Record<ProfileId, { avg: number; votes: number; cost?: number }>>;
};

type SeedCity = {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  lat: number;
  lng: number;
  places: SeedPlace[];
  tips: { profile: ProfileId; kind: TipKind; title: string; body: string; helpful: number }[];
};

const CITIES: SeedCity[] = [
  {
    slug: "koh-phangan",
    name: "Koh Phangan",
    country: "Thailand",
    tagline: "Yoga, jungle, beaches, and a west coast full of people who stayed longer than planned.",
    lat: 9.73,
    lng: 100.01,
    places: [
      { name: "Banyan Roots Farmstay", category: "sleep", description: "Permaculture farm up the hill. Four hours of help a day for a bungalow and two meals.", priceLevel: 1, acceptsVolunteers: true, votes: { volunteer: { avg: 4.7, votes: 9, cost: 0 }, nomad: { avg: 3.2, votes: 3, cost: 0 } } },
      { name: "Lantern Hostel Srithanu", category: "sleep", description: "Dorms and private rooms a short walk from the yoga shalas. Monthly rate on request.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.3, votes: 12, cost: 420 }, volunteer: { avg: 3.9, votes: 4, cost: 300 }, luxury: { avg: 2.1, votes: 3 } } },
      { name: "Driftwood Pool Villas", category: "sleep", description: "Private pool villas on the quiet north coast. Breakfast on the deck, driver included.", priceLevel: 4, votes: { luxury: { avg: 4.8, votes: 6, cost: 5400 }, nomad: { avg: 3.5, votes: 2 } } },
      { name: "Coconut Desk", category: "work", description: "Coworking with fibre, standing desks and a quiet call room. Day, week and month passes.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.6, votes: 15, cost: 120 }, expat: { avg: 4.2, votes: 5 } } },
      { name: "Nam's Kitchen", category: "food", description: "Family-run Thai place behind the market. The whiteboard menu changes daily.", priceLevel: 1, votes: { volunteer: { avg: 4.9, votes: 7 }, nomad: { avg: 4.5, votes: 10 }, expat: { avg: 4.7, votes: 8 }, luxury: { avg: 3.4, votes: 3 } } },
      { name: "Salt & Ember", category: "food", description: "Beachfront grill with a long wine list. Book the sunset table.", priceLevel: 4, votes: { luxury: { avg: 4.6, votes: 5 }, nomad: { avg: 3.8, votes: 4 } } },
      { name: "Thursday Ecstatic Dance", category: "fun", description: "Weekly barefoot dance in an open shala. Donation based, water included.", priceLevel: 1, votes: { volunteer: { avg: 4.6, votes: 6 }, nomad: { avg: 4.1, votes: 8 }, expat: { avg: 3.6, votes: 4 } } },
      { name: "Longtail Snorkel Day", category: "fun", description: "Private boat to the marine park, lunch on board, back for sunset.", priceLevel: 3, votes: { luxury: { avg: 4.4, votes: 4 }, nomad: { avg: 4.0, votes: 3 } } },
      { name: "Sunday Expat Potluck", category: "community", description: "Open potluck on the hill every Sunday. Bring a dish, meet everyone who lives here.", priceLevel: 1, votes: { expat: { avg: 4.8, votes: 9 }, nomad: { avg: 4.3, votes: 6 }, volunteer: { avg: 4.5, votes: 4 } } },
    ],
    tips: [
      { profile: "expat", kind: "facebook_group", title: "Island long-term rentals group", body: "Where houses are posted before they reach the agencies. Say how many months you want up front; 6+ months gets a different price.", helpful: 14 },
      { profile: "expat", kind: "long_term", title: "Scooter rental: ask for the monthly rate, never the daily", body: "Daily rates are for tourists. Monthly is roughly a third of 30 daily payments, and they will hold the deposit instead of your passport.", helpful: 11 },
      { profile: "nomad", kind: "whatsapp_group", title: "Srithanu nomads WhatsApp", body: "Coworking day passes, shared trips to the mainland, visa-run car shares. Ask at Coconut Desk for the invite.", helpful: 9 },
      { profile: "volunteer", kind: "advice", title: "Farms want you for at least three weeks", body: "Short stays cost hosts more than they gain. Offer three weeks and you will get a yes from the good ones.", helpful: 8 },
      { profile: "luxury", kind: "discount", title: "Villas drop 30% in May and June", body: "Green season, still mostly sunny mornings. Ask the villa directly instead of booking through a platform.", helpful: 4 },
    ],
  },
  {
    slug: "chiang-mai",
    name: "Chiang Mai",
    country: "Thailand",
    tagline: "The original nomad base: cheap, calm, cafés on every corner, mountains an hour away.",
    lat: 18.79,
    lng: 98.98,
    places: [
      { name: "Nimman Nest Apartments", category: "sleep", description: "Studios with a desk and fast wifi, one block from the cafés. Monthly contracts, no agent fee.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.5, votes: 18, cost: 380 }, expat: { avg: 4.1, votes: 6 } } },
      { name: "Doi Suthep Temple Stay", category: "sleep", description: "Help the monastery garden and kitchen in exchange for a room and meals. Early mornings.", priceLevel: 1, acceptsVolunteers: true, votes: { volunteer: { avg: 4.4, votes: 5, cost: 0 } } },
      { name: "The Teak House", category: "sleep", description: "Restored teak mansion by the river. Six suites, a pool, and a chef who shops the morning market.", priceLevel: 4, votes: { luxury: { avg: 4.9, votes: 7, cost: 4800 } } },
      { name: "Hub 53", category: "work", description: "Big coworking with 24h access, phone booths and a rooftop. Busy but reliable.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.4, votes: 22, cost: 110 } } },
      { name: "Khao Soi Mae Sai", category: "food", description: "The khao soi everyone argues about. Open until the pot is empty, usually by 2pm.", priceLevel: 1, votes: { nomad: { avg: 4.8, votes: 14 }, volunteer: { avg: 4.9, votes: 6 }, expat: { avg: 4.7, votes: 9 }, luxury: { avg: 4.2, votes: 3 } } },
      { name: "Saturday Walking Street", category: "fun", description: "The Wualai market: food, crafts, music. Go early, eat late.", priceLevel: 1, votes: { nomad: { avg: 4.3, votes: 9 }, volunteer: { avg: 4.6, votes: 5 }, luxury: { avg: 3.5, votes: 3 } } },
      { name: "Nimman Language Exchange", category: "community", description: "Thai and English tables every Wednesday. Free, friendly, and the fastest way to meet people who live here.", priceLevel: 1, votes: { expat: { avg: 4.6, votes: 8 }, nomad: { avg: 4.4, votes: 7 } } },
    ],
    tips: [
      { profile: "nomad", kind: "advice", title: "Avoid February and March if you can", body: "Burning season. Air quality gets bad for weeks. Nomads who stay year-round leave for the coast in those months.", helpful: 21 },
      { profile: "expat", kind: "facebook_group", title: "Chiang Mai condos direct from owners", body: "Owners post here to skip agencies. Monthly price is usually 20% under what the same unit lists for on booking platforms.", helpful: 13 },
      { profile: "volunteer", kind: "advice", title: "Elephant sanctuaries: ask about riding before you commit", body: "If they offer rides, it is not a sanctuary. The good ones need help with food prep and fences and give a bed for it.", helpful: 10 },
    ],
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    tagline: "Hills, light, pastel de nata, and the most crowded nomad scene in Europe.",
    lat: 38.72,
    lng: -9.14,
    places: [
      { name: "Alfama Rooftop Hostel", category: "sleep", description: "Small hostel with a terrace over the river. Work from the common room in the mornings.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.0, votes: 11, cost: 700 }, volunteer: { avg: 4.2, votes: 4, cost: 0 } } },
      { name: "Quinta das Oliveiras", category: "sleep", description: "Olive farm 40 minutes out. Harvest help in autumn, pruning in winter, bed and meals year-round.", priceLevel: 1, acceptsVolunteers: true, votes: { volunteer: { avg: 4.8, votes: 7, cost: 0 } } },
      { name: "Palácio Verde", category: "sleep", description: "Boutique hotel in a restored palace. Quiet garden, excellent breakfast, concierge who knows the city.", priceLevel: 4, votes: { luxury: { avg: 4.7, votes: 8, cost: 7200 } } },
      { name: "Second Home Lisboa", category: "work", description: "Plant-filled coworking in a market hall. Not cheap, very reliable.", priceLevel: 3, workFriendly: true, votes: { nomad: { avg: 4.5, votes: 16, cost: 260 } } },
      { name: "Tasca do Zé", category: "food", description: "Neighbourhood tasca with a handwritten menu. Lunch deal with wine for a few euros.", priceLevel: 1, votes: { nomad: { avg: 4.6, votes: 12 }, expat: { avg: 4.8, votes: 10 }, volunteer: { avg: 4.7, votes: 5 }, luxury: { avg: 3.9, votes: 3 } } },
      { name: "Fado at Mesa de Frades", category: "fun", description: "Fado in a tiny former chapel. Dinner is part of the experience; book days ahead.", priceLevel: 3, votes: { luxury: { avg: 4.6, votes: 6 }, nomad: { avg: 4.4, votes: 5 }, expat: { avg: 4.1, votes: 4 } } },
      { name: "Lisbon Expats Meetup", category: "community", description: "Monthly drinks that have been running for years. Newcomers welcome, questions answered.", priceLevel: 1, votes: { expat: { avg: 4.5, votes: 11 }, nomad: { avg: 4.0, votes: 6 } } },
    ],
    tips: [
      { profile: "expat", kind: "long_term", title: "Rent from September; prices fall after summer", body: "Short-term lets flood the long-term market in autumn. Landlords prefer 12-month contracts; mention it first.", helpful: 17 },
      { profile: "nomad", kind: "discount", title: "Navegante monthly transport pass", body: "Covers metro, trams, buses and the ferry for the whole metro area. Tourists pay per ride and lose money within a week.", helpful: 12 },
      { profile: "volunteer", kind: "advice", title: "Harvest season is the easiest time to get a farm placement", body: "September to November for grapes and olives. Hosts need hands, and winter stays are harder to find.", helpful: 6 },
    ],
  },
  {
    slug: "canggu",
    name: "Canggu",
    country: "Indonesia",
    tagline: "Surf at sunrise, laptop by noon, and a scooter traffic jam you learn to love.",
    lat: -8.65,
    lng: 115.14,
    places: [
      { name: "Rice Field Guesthouse", category: "sleep", description: "Family guesthouse between the paddies. Monthly rooms with a desk, breakfast with the family.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.4, votes: 14, cost: 450 }, volunteer: { avg: 3.8, votes: 3 } } },
      { name: "Bali Dog Rescue Volunteer House", category: "sleep", description: "Walk, feed and clean for the rescue; shared house and meals included.", priceLevel: 1, acceptsVolunteers: true, votes: { volunteer: { avg: 4.6, votes: 8, cost: 0 } } },
      { name: "Tideline Villas", category: "sleep", description: "Cliff-edge villas with private pools and an in-house surf guide.", priceLevel: 4, votes: { luxury: { avg: 4.5, votes: 6, cost: 6000 }, nomad: { avg: 3.3, votes: 2 } } },
      { name: "Outpost Canggu", category: "work", description: "Coworking with a pool, nap room and dependable fibre. The 24h access matters in a surf town.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.7, votes: 20, cost: 180 } } },
      { name: "Warung Ibu Sari", category: "food", description: "Nasi campur from a glass cabinet. Point, pay, sit. Locals and nomads in equal numbers.", priceLevel: 1, votes: { nomad: { avg: 4.7, votes: 13 }, volunteer: { avg: 4.8, votes: 6 }, expat: { avg: 4.6, votes: 7 } } },
      { name: "Sunset Surf Session", category: "fun", description: "Board rental and a beginner lesson at the softest break on the beach.", priceLevel: 2, votes: { nomad: { avg: 4.5, votes: 9 }, luxury: { avg: 4.0, votes: 3 }, volunteer: { avg: 4.4, votes: 4 } } },
      { name: "Canggu Community Gardens", category: "community", description: "Volunteer-run garden with Saturday workdays and a shared lunch after.", priceLevel: 1, votes: { volunteer: { avg: 4.7, votes: 5 }, expat: { avg: 4.3, votes: 6 } } },
    ],
    tips: [
      { profile: "expat", kind: "whatsapp_group", title: "Canggu villa and room board", body: "Rooms in shared villas posted daily. Monthly deals are far below nightly rates; ask for the yearly price if you can commit.", helpful: 15 },
      { profile: "nomad", kind: "advice", title: "Get a local SIM with a data plan before you rely on café wifi", body: "Power cuts happen. A 4G hotspot keeps the call alive.", helpful: 9 },
      { profile: "luxury", kind: "discount", title: "Villa managers discount direct bookings of 7+ nights", body: "Platforms take 15% or more. Email the villa; most will match or beat the listed price for a week or longer.", helpful: 5 },
    ],
  },
  {
    slug: "medellin",
    name: "Medellín",
    country: "Colombia",
    tagline: "Eternal spring, cable cars over the hills, and a city that reinvented itself.",
    lat: 6.25,
    lng: -75.56,
    places: [
      { name: "Laureles Coliving", category: "sleep", description: "Shared house with private rooms, a big kitchen and a work room. Monthly only.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.4, votes: 13, cost: 520 }, expat: { avg: 4.0, votes: 4 } } },
      { name: "Finca La Esperanza", category: "sleep", description: "Coffee farm an hour out. Help with the harvest and the cabins, sleep in one of them.", priceLevel: 1, acceptsVolunteers: true, votes: { volunteer: { avg: 4.9, votes: 10, cost: 0 } } },
      { name: "Hotel Mirador El Poblado", category: "sleep", description: "Rooftop pool with a view over the whole valley. Spa, driver, and a bar worth the stay alone.", priceLevel: 4, votes: { luxury: { avg: 4.6, votes: 7, cost: 4500 } } },
      { name: "Selina Cowork Poblado", category: "work", description: "Coworking with meeting rooms and a terrace. Reliable, busy, central.", priceLevel: 2, workFriendly: true, votes: { nomad: { avg: 4.2, votes: 17, cost: 140 } } },
      { name: "Doña Rosa Almuerzos", category: "food", description: "Menu del día with soup, main and juice. Full of office workers at noon.", priceLevel: 1, votes: { nomad: { avg: 4.6, votes: 11 }, volunteer: { avg: 4.8, votes: 6 }, expat: { avg: 4.7, votes: 9 } } },
      { name: "Comuna 13 Graffiti Walk", category: "fun", description: "Guided walk through the murals and escalators, led by people from the neighbourhood.", priceLevel: 1, votes: { nomad: { avg: 4.7, votes: 12 }, volunteer: { avg: 4.9, votes: 5 }, luxury: { avg: 4.3, votes: 4 }, expat: { avg: 4.0, votes: 3 } } },
      { name: "Tuesday Spanish Conversation Club", category: "community", description: "Spanish practice tables at a café in Laureles. Pay for your coffee, nothing else.", priceLevel: 1, votes: { expat: { avg: 4.5, votes: 7 }, nomad: { avg: 4.6, votes: 9 }, volunteer: { avg: 4.4, votes: 3 } } },
    ],
    tips: [
      { profile: "expat", kind: "facebook_group", title: "Medellín apartments without agencies", body: "Owners post furnished flats here. Agencies ask for a Colombian co-signer; owners here usually take a deposit instead.", helpful: 16 },
      { profile: "nomad", kind: "advice", title: "Laureles is quieter and cheaper than Poblado", body: "Same metro line, half the noise, and the cafés are full of locals. Most people who stay more than two months end up there.", helpful: 12 },
      { profile: "volunteer", kind: "advice", title: "Coffee farms recruit from October to December", body: "Main harvest. Hosts take volunteers for cabin upkeep and picking; bring boots.", helpful: 7 },
    ],
  },
];

const FIRST_NAMES = ["Ana", "Ben", "Chloé", "Dmitri", "Elena", "Farid", "Gabi", "Hugo", "Ines", "Jonas", "Kaya", "Luca", "Maya", "Nico", "Olga", "Pedro", "Quinn", "Rosa", "Sven", "Tara", "Uma", "Vera", "Wes", "Xan", "Yara", "Zoe"];

const PROFILE_COMMENTS: Record<ProfileId, string[]> = {
  nomad: ["Wifi held a full day of calls.", "Monthly rate was easy to get, just ask.", "Quiet in the mornings, busy after lunch.", "Would stay another month.", "Power cut once, hotspot saved me."],
  volunteer: ["Host was fair: hours as agreed, food was great.", "Got real work experience, not just chores.", "Three weeks minimum, worth every day.", "Shared room but a good crowd.", "Would go back next season."],
  luxury: ["Worth the price for the service alone.", "Booked direct and got a better rate.", "Breakfast was the best part.", "Driver and concierge made the week.", "Quiet, private, exactly as promised."],
  expat: ["This is where locals actually go.", "Long-term price is half the tourist price.", "Ask for the owner by name.", "Been going for two years.", "Join the group first, then show up."],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function slugify(s: string) {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Build `n` integer ratings in 1..5 whose mean is close to `avg`. */
function ratingsFor(avg: number, n: number, rand: () => number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const noise = (rand() - 0.5) * 1.6;
    out.push(Math.max(1, Math.min(5, Math.round(avg + noise))));
  }
  const mean = out.reduce((a, b) => a + b, 0) / n;
  const diff = Math.round((avg - mean) * n);
  for (let i = 0; i < Math.abs(diff); i++) {
    const idx = i % n;
    out[idx] = Math.max(1, Math.min(5, out[idx] + Math.sign(diff)));
  }
  return out;
}

async function main() {
  const rand = seededRandom(42);

  // 40 fictional reviewers, 10 per profile-ish. All sample accounts.
  const userRows: { id: string; name: string; email: string }[] = [];
  for (let i = 0; i < 40; i++) {
    const name = `${FIRST_NAMES[i % FIRST_NAMES.length]} ${String.fromCharCode(65 + (i % 26))}.`;
    userRows.push({ id: `sample-user-${i}`, name, email: `sample-${i}@example.com` });
  }
  await db.insert(users).values(userRows).onConflictDoNothing();

  for (const c of CITIES) {
    const [existing] = await db.select().from(cities).where(eq(cities.slug, c.slug)).limit(1);
    const city =
      existing ??
      (await db.insert(cities).values({ slug: c.slug, name: c.name, country: c.country, tagline: c.tagline, latitude: c.lat, longitude: c.lng }).returning())[0];

    for (const p of c.places) {
      const slug = slugify(p.name);
      const [placeRow] = await db
        .insert(places)
        .values({
          cityId: city.id,
          slug,
          name: p.name,
          category: p.category,
          description: p.description,
          priceLevel: p.priceLevel,
          acceptsVolunteers: p.acceptsVolunteers ?? false,
          workFriendly: p.workFriendly ?? false,
          isSample: true,
        })
        .onConflictDoNothing()
        .returning();
      if (!placeRow) continue; // already seeded

      let userCursor = Math.floor(rand() * userRows.length);
      for (const [profile, target] of Object.entries(p.votes) as [ProfileId, { avg: number; votes: number; cost?: number }][]) {
        const ratings = ratingsFor(target.avg, target.votes, rand);
        const comments = PROFILE_COMMENTS[profile];
        const rows = ratings.map((rating, i) => {
          const user = userRows[(userCursor + i) % userRows.length];
          return {
            placeId: placeRow.id,
            userId: user.id,
            profile,
            rating,
            body: rand() < 0.6 ? comments[Math.floor(rand() * comments.length)] : null,
            stayDays: profile === "luxury" ? 3 + Math.floor(rand() * 10) : 14 + Math.floor(rand() * 60),
            monthlyCostUsd: target.cost ?? null,
            visitedYear: 2024 + Math.floor(rand() * 3),
          };
        });
        userCursor += target.votes;
        await db.insert(reviews).values(rows).onConflictDoNothing();
      }
    }

    for (const t of c.tips) {
      await db.insert(tips).values({
        cityId: city.id,
        userId: userRows[Math.floor(rand() * userRows.length)].id,
        profile: t.profile,
        kind: t.kind,
        title: t.title,
        body: t.body,
        helpfulCount: t.helpful,
        isSample: true,
      });
    }
    console.log(`seeded ${c.name}: ${c.places.length} places, ${c.tips.length} tips`);
  }
}

main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
