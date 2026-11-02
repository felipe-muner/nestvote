import { HomeNav } from "@/components/home/home-nav";
import { DarkFooter } from "@/components/home/site-footer";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="dark theme-nest flex min-h-dvh flex-col overflow-x-clip bg-background text-foreground antialiased selection:bg-emerald-500/40">
      <HomeNav />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-5 pb-16 pt-24 sm:px-8 lg:px-12 lg:pt-28">{children}</main>
      <DarkFooter />
    </div>
  );
}
