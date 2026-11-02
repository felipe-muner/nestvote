import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ---------- Traveler profiles ----------
// The whole product is keyed on this: every rating is given *as* a profile,
// so "5 stars from 10 volunteers" and "2 stars from 4 luxury travelers" can
// coexist for the same place.
export const PROFILE_IDS = ["nomad", "volunteer", "luxury", "expat"] as const;
export type ProfileId = (typeof PROFILE_IDS)[number];
export const profileEnum = pgEnum("profile", PROFILE_IDS);

// What a place is for.
export const CATEGORY_IDS = ["sleep", "food", "fun", "work", "community"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];
export const categoryEnum = pgEnum("category", CATEGORY_IDS);

// Expat tips: the stuff you only learn after living somewhere.
export const TIP_KINDS = ["facebook_group", "whatsapp_group", "discount", "long_term", "advice"] as const;
export type TipKind = (typeof TIP_KINDS)[number];
export const tipKindEnum = pgEnum("tip_kind", TIP_KINDS);

// ---------- Auth (NextAuth / Auth.js Drizzle adapter) ----------
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// ---------- Content ----------
export const cities = pgTable("cities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  region: text("region"),
  tagline: text("tagline"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const places = pgTable(
  "places",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    cityId: text("city_id").notNull().references(() => cities.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    category: categoryEnum("category").notNull(),
    description: text("description"),
    address: text("address"),
    website: text("website"),
    /** 1 = free / very cheap, 4 = luxury */
    priceLevel: integer("price_level"),
    /** Volunteers: does this place take helpers in exchange for bed and food? */
    acceptsVolunteers: boolean("accepts_volunteers").default(false).notNull(),
    /** Nomads: reliable wifi / desks / power */
    workFriendly: boolean("work_friendly").default(false).notNull(),
    createdById: text("created_by_id").references(() => users.id, { onDelete: "set null" }),
    isSample: boolean("is_sample").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("places_city_slug").on(t.cityId, t.slug)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    placeId: text("place_id").notNull().references(() => places.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    /** The profile the reviewer was travelling as when they rated the place. */
    profile: profileEnum("profile").notNull(),
    rating: integer("rating").notNull(), // 1..5
    body: text("body"),
    /** How long they stayed / used it, in days. Long stays weigh more for nomads and expats. */
    stayDays: integer("stay_days"),
    /** What it cost them per month, in USD, if they want to share. */
    monthlyCostUsd: integer("monthly_cost_usd"),
    visitedYear: integer("visited_year"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  // One rating per user, per place, per profile. Re-submitting updates it.
  (t) => [uniqueIndex("reviews_user_place_profile").on(t.userId, t.placeId, t.profile)],
);

export const tips = pgTable("tips", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cityId: text("city_id").notNull().references(() => cities.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  profile: profileEnum("profile").notNull(),
  kind: tipKindEnum("kind").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  url: text("url"),
  helpfulCount: integer("helpful_count").default(0).notNull(),
  isSample: boolean("is_sample").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tipVotes = pgTable(
  "tip_votes",
  {
    tipId: text("tip_id").notNull().references(() => tips.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.tipId, t.userId] })],
);

export type City = typeof cities.$inferSelect;
export type Place = typeof places.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Tip = typeof tips.$inferSelect;
