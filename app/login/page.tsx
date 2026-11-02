import { signInWithGoogle } from "@/lib/actions";
import { googleConfigured } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6 pt-10 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Sign in to vote</h1>
      <p className="text-muted-foreground">
        One account, one vote per profile per place. That is what keeps &ldquo;recommended by 10 volunteers&rdquo; worth something.
      </p>
      {googleConfigured ? (
        <form action={signInWithGoogle}>
          <Button type="submit" size="lg">
            Continue with Google
          </Button>
        </form>
      ) : (
        <p className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          Google sign-in is not configured on this deployment. Set <code>GOOGLE_CLIENT_ID</code> and{" "}
          <code>GOOGLE_CLIENT_SECRET</code> (see <code>.env.example</code>).
        </p>
      )}
    </div>
  );
}
