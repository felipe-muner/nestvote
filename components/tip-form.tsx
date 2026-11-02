"use client";

import { useActionState } from "react";
import { submitTip, type ActionState } from "@/lib/actions";
import { PROFILE_LIST, TIP_KIND_META } from "@/lib/profiles";
import { TIP_KINDS } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TipForm({ citySlug }: { citySlug: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitTip, null);

  return (
    <form action={action} className="space-y-4 rounded-xl border bg-card p-4">
      <input type="hidden" name="citySlug" value={citySlug} />

      <div className="space-y-2">
        <Label>Useful for</Label>
        <div className="flex flex-wrap gap-2">
          {PROFILE_LIST.map((p, i) => (
            <label key={p.id} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm has-checked:border-foreground has-checked:bg-foreground has-checked:text-background">
              <input type="radio" name="profile" value={p.id} defaultChecked={i === 3} className="sr-only" />
              <span aria-hidden>{p.emoji}</span> {p.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Kind of tip</Label>
        <div className="flex flex-wrap gap-2">
          {TIP_KINDS.map((k, i) => (
            <label key={k} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm has-checked:border-foreground has-checked:bg-foreground has-checked:text-background">
              <input type="radio" name="kind" value={k} defaultChecked={i === 0} className="sr-only" />
              <span aria-hidden>{TIP_KIND_META[k].emoji}</span> {TIP_KIND_META[k].label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required minLength={3} placeholder="e.g. 'Long-term renters' Facebook group' or 'Scooter rental: ask for the monthly rate'" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="url">Link</Label>
        <Input id="url" name="url" type="url" placeholder="https:// (group link, menu, listing)" />
      </div>
      <div className="space-y-1">
        <Label htmlFor="body">Details</Label>
        <Textarea id="body" name="body" rows={3} placeholder="How to get in, what to say, what it costs long term vs. as a tourist." />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Sharing..." : "Share tip"}
        </Button>
        {state ? <p className={state.ok ? "text-sm text-emerald-700" : "text-sm text-destructive"}>{state.message}</p> : null}
      </div>
    </form>
  );
}
