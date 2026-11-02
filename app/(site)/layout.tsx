import { SiteFooter, SiteHeader } from "@/components/site-header";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-8 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </>
  );
}
