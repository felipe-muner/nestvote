import Link from "next/link";

const ITEMS = [
  { id: "cities", label: "Cities", page: "/cities" },
  { id: "how", label: "How it works", page: "/#how" },
  { id: "why", label: "Why", page: "/#why" },
];

const CLASS = "rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white";

/**
 * On the home page these are plain in-page anchors so the Lenis click handler can
 * animate the scroll (Next's Link would intercept the click and jump). Everywhere
 * else they navigate to the home sections or the cities page.
 */
export function NavLinks({ onHome }: { onHome: boolean }) {
  return (
    <>
      {ITEMS.map((item) =>
        onHome ? (
          <a key={item.id} href={`#${item.id}`} className={CLASS}>
            {item.label}
          </a>
        ) : (
          <Link key={item.id} href={item.page} className={CLASS}>
            {item.label}
          </Link>
        ),
      )}
    </>
  );
}
