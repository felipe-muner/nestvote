"use client";

import { useActionState } from "react";
import { submitPlace, type ActionState } from "@/lib/actions";
import { CATEGORIES } from "@/lib/profiles";
import { CATEGORY_IDS } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PlaceForm({ cities, defaultCity }: { cities: { slug: string; name: string; country: string }[]; defaultCity?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitPlace, null);

  return (
    <form action={action} className="space-y-4 rounded-xl border bg-card p-4">
      <div className="space-y-1">
        <Label htmlFor="citySlug">City</Label>
        <select id="citySlug" name="citySlug" defaultValue={defaultCity ?? cities[0]?.slug} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}, {c.country}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="name">Place name</Label>
        <Input id="name" name="name" required minLength={2} placeholder="Hostel, café, coworking, farm, beach club..." />
      </div>

      <div className="space-y-2">
        <Label>What is it for?</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_IDS.map((c, i) => (
            <label key={c} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm has-checked:border-foreground has-checked:bg-foreground has-checked:text-background">
              <input type="radio" name="category" value={c} defaultChecked={i === 0} className="sr-only" />
              <span aria-hidden>{CATEGORIES[c].emoji}</span> {CATEGORIES[c].label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} placeholder="What it is, what makes it worth it, for whom." />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="address">Address or area</Label>
          <Input id="address" name="address" placeholder="Neighbourhood is enough" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" type="url" placeholder="https://" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Price level</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <label key={n} className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm has-checked:border-foreground has-checked:bg-foreground has-checked:text-background">
              <input type="radio" name="priceLevel" value={n} defaultChecked={n === 2} className="sr-only" />
              {"$".repeat(n)}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="acceptsVolunteers" /> Takes volunteers (bed and food for help)
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="workFriendly" /> Work-friendly (wifi, desks, power)
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add place"}
        </Button>
        {state ? <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-destructive"}>{state.message}</p> : null}
      </div>
    </form>
  );
}
