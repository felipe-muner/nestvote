"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth, signIn, signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { CATEGORY_IDS, PROFILE_IDS, TIP_KINDS, cities, places, reviews, tipVotes, tips } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

export type ActionState = { ok: boolean; message: string } | null;

const optionalInt = (min: number, max: number) =>
  z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().int().min(min).max(max).optional());

const reviewSchema = z.object({
  placeId: z.string().min(1),
  citySlug: z.string().min(1),
  placeSlug: z.string().min(1),
  profile: z.enum(PROFILE_IDS),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().max(2000).optional(),
  stayDays: optionalInt(1, 3650),
  monthlyCostUsd: optionalInt(0, 100000),
  visitedYear: optionalInt(2000, 2100),
});

export async function submitReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Sign in to vote. It takes one click and keeps the ratings honest." };

  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const d = parsed.data;

  await db
    .insert(reviews)
    .values({
      placeId: d.placeId,
      userId: session.user.id,
      profile: d.profile,
      rating: d.rating,
      body: d.body || null,
      stayDays: d.stayDays ?? null,
      monthlyCostUsd: d.monthlyCostUsd ?? null,
      visitedYear: d.visitedYear ?? null,
    })
    .onConflictDoUpdate({
      target: [reviews.userId, reviews.placeId, reviews.profile],
      set: {
        rating: d.rating,
        body: d.body || null,
        stayDays: d.stayDays ?? null,
        monthlyCostUsd: d.monthlyCostUsd ?? null,
        visitedYear: d.visitedYear ?? null,
        createdAt: new Date(),
      },
    });

  revalidatePath(`/${d.citySlug}`);
  revalidatePath(`/${d.citySlug}/${d.placeSlug}`);
  return { ok: true, message: "Thanks. Your vote is in, and the next traveler with your profile will see it." };
}

const placeSchema = z.object({
  citySlug: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  category: z.enum(CATEGORY_IDS),
  description: z.string().trim().max(2000).optional(),
  address: z.string().trim().max(300).optional(),
  website: z.string().trim().url().optional().or(z.literal("")),
  priceLevel: optionalInt(1, 4),
  acceptsVolunteers: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
  workFriendly: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
});

export async function submitPlace(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Sign in to add a place." };

  const parsed = placeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const d = parsed.data;

  const [city] = await db.select().from(cities).where(eq(cities.slug, d.citySlug)).limit(1);
  if (!city) return { ok: false, message: "Unknown city." };

  const base = slugify(d.name) || "place";
  const [existing] = await db
    .select({ id: places.id })
    .from(places)
    .where(and(eq(places.cityId, city.id), eq(places.slug, base)))
    .limit(1);
  const slug = existing ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base;

  await db.insert(places).values({
    cityId: city.id,
    slug,
    name: d.name,
    category: d.category,
    description: d.description || null,
    address: d.address || null,
    website: d.website || null,
    priceLevel: d.priceLevel ?? null,
    acceptsVolunteers: d.acceptsVolunteers,
    workFriendly: d.workFriendly,
    createdById: session.user.id,
  });

  revalidatePath(`/${city.slug}`);
  redirect(`/${city.slug}/${slug}`);
}

const tipSchema = z.object({
  citySlug: z.string().min(1),
  profile: z.enum(PROFILE_IDS),
  kind: z.enum(TIP_KINDS),
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().max(2000).optional(),
  url: z.string().trim().url().optional().or(z.literal("")),
});

export async function submitTip(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Sign in to share a tip." };

  const parsed = tipSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form." };
  const d = parsed.data;

  const [city] = await db.select().from(cities).where(eq(cities.slug, d.citySlug)).limit(1);
  if (!city) return { ok: false, message: "Unknown city." };

  await db.insert(tips).values({
    cityId: city.id,
    userId: session.user.id,
    profile: d.profile,
    kind: d.kind,
    title: d.title,
    body: d.body || null,
    url: d.url || null,
  });

  revalidatePath(`/${city.slug}/tips`);
  return { ok: true, message: "Tip shared. Thank you for saving the next person's afternoon." };
}

export async function voteTip(tipId: string, citySlug: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const inserted = await db
    .insert(tipVotes)
    .values({ tipId, userId: session.user.id })
    .onConflictDoNothing()
    .returning({ tipId: tipVotes.tipId });
  if (inserted.length > 0) {
    await db
      .update(tips)
      .set({ helpfulCount: sql`${tips.helpfulCount} + 1` })
      .where(eq(tips.id, tipId));
  }
  revalidatePath(`/${citySlug}/tips`);
}

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInDemo(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  await signIn("demo", { name, redirectTo: "/" });
}
