import { signInDemo, signInWithGoogle } from "@/lib/actions";
import { demoLoginEnabled, googleConfigured } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-8 pt-10 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sign in to vote</h1>
        <p className="text-muted-foreground">
          One account, one vote per profile per place. That is what keeps &ldquo;recommended by 10 volunteers&rdquo; worth something.
        </p>
      </div>

      {googleConfigured ? (
        <form action={signInWithGoogle}>
          <Button type="submit" size="lg">
            Continue with Google
          </Button>
        </form>
      ) : null}

      {demoLoginEnabled ? (
        <form action={signInDemo} className="space-y-3 rounded-xl border bg-card p-4 text-left">
          <div className="space-y-1">
            <Label htmlFor="name">Pick a name</Label>
            <Input id="name" name="name" required minLength={2} maxLength={40} placeholder="e.g. Ana from Lisbon" autoComplete="off" />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
          <p className="text-xs text-muted-foreground">
            No password, no email. Use the same name next time and your votes stay yours. One vote per name, per profile, per place.
          </p>
        </form>
      ) : null}

      {!googleConfigured && !demoLoginEnabled ? (
        <p className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          No sign-in method is configured. Set <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>, or <code>DEMO_LOGIN=true</code>.
        </p>
      ) : null}
    </div>
  );
}
