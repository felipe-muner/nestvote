import { LogoMark } from "@/components/logo";

/** Wordmark footer shared by every page. */
export function DarkFooter() {
  return (
    <footer className="relative overflow-hidden px-5 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <LogoMark size={16} nest="#F59E0B" check="#34D399" /> NestVote · open source on{" "}
          <a className="underline" href="https://github.com/felipe-muner/nestvote" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </span>
        <span>Sample cities and votes are fictional until real ones replace them.</span>
      </div>
      <div className="relative mt-10">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(55%_100%_at_50%_120%,rgba(16,185,129,0.3),transparent_70%)]" />
        <p aria-hidden className="relative -mb-[0.14em] select-none whitespace-nowrap bg-gradient-to-b from-white/80 via-white/25 to-white/0 bg-clip-text text-center font-heading text-[17vw] italic leading-none tracking-[-0.04em] text-transparent">
          NestVote
        </p>
      </div>
    </footer>
  );
}
