import Link from "next/link";
import { Suspense } from "react";
import { AuthButtons } from "@/components/auth-buttons";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="NestVote home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2">
          <Button size="sm" variant="ghost" render={<Link href="/submit" />}>Add a place</Button>
          <Suspense fallback={<div className="h-8 w-16 rounded-md bg-muted" />}>
            <AuthButtons />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <LogoMark size={18} /> Places voted by people who travel like you.
        </p>
        <p>
          Open source on{" "}
          <a className="underline" href="https://github.com/felipe-muner/nestvote" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          . Sample cities and reviews are fictional until real votes replace them.
        </p>
      </div>
    </footer>
  );
}
