"use client";

import { useActionState } from "react";
import { submitReview, type ActionState } from "@/lib/actions";
import type { ProfileId } from "@/lib/db/schema";
import { PROFILE_LIST } from "@/lib/profiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReviewForm({
  placeId,
  citySlug,
  placeSlug,
  defaultProfile,
  signedIn,
}: {
  placeId: string;
  citySlug: string;
  placeSlug: string;
  defaultProfile: ProfileId;
  signedIn: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitReview, null);

  return (
    <form action={action} className="space-y-4 rounded-xl border bg-card p-4">
      <input type="hidden" name="placeId" value={placeId} />
      <input type="hidden" name="citySlug" value={citySlug} />
      <input type="hidden" name="placeSlug" value={placeSlug} />

      <div className="space-y-2">
        <Label>I was here as a</Label>
        <div className="flex flex-wrap gap-2">
          {PROFILE_LIST.map((p) => (
            <label key={p.id} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm has-checked:border-foreground has-checked:bg-foreground has-checked:text-background">
              <input type="radio" name="profile" value={p.id} defaultChecked={p.id === defaultProfile} className="sr-only" />
              <span aria-hidden>{p.emoji}</span> {p.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>My rating</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium has-checked:border-amber-400 has-checked:bg-amber-100 has-checked:text-amber-900">
              <input type="radio" name="rating" value={n} defaultChecked={n === 5} className="sr-only" />
              {n}★
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">What should the next person know?</Label>
        <Textarea id="body" name="body" rows={3} placeholder="Wifi speed, the deal you got, who to ask for, what to avoid..." />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label htmlFor="stayDays">Days stayed</Label>
          <Input id="stayDays" name="stayDays" type="number" min={1} placeholder="30" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="monthlyCostUsd">Cost per month (USD)</Label>
          <Input id="monthlyCostUsd" name="monthlyCostUsd" type="number" min={0} placeholder="0 if free" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="visitedYear">Year</Label>
          <Input id="visitedYear" name="visitedYear" type="number" min={2000} max={2100} placeholder="2026" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : signedIn ? "Cast my vote" : "Sign in to vote"}
        </Button>
        {state ? <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-destructive"}>{state.message}</p> : null}
      </div>
    </form>
  );
}
