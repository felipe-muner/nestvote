import Link from "next/link";

const ITEMS = [
  { id: "cities", label: "Cities", page: "/cities" },
  { id: "how", label: "How it works", page: "/#how" },
  { id: "why", label: "Why", page: "/#why" },
];

/**
 * On the home page these are in-page anchors (Lenis animates the scroll);
 * everywhere else they navigate back to the home sections or the cities page.
 */
export function NavLinks({ onHome }: { onHome: boolean }) {
  return (
    <>
      {ITEMS.map((item) => (
        <Link
          key={item.id}
          href={onHome ? `#${item.id}` : item.page}
          className="rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
