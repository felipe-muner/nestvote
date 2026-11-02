import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export async function AuthButtons() {
  await connection();
  const session = await auth();
  if (!session?.user) {
    return (
      <Button size="sm" variant="outline" render={<Link href="/login" />}>Sign in</Button>
    );
  }
  return (
    <form action={signOutAction} className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">{session.user.name ?? session.user.email}</span>
      <Button type="submit" size="sm" variant="ghost">
        Sign out
      </Button>
    </form>
  );
}
