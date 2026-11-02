import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="space-y-4 pt-8 text-center">
      <h1 className="font-sans text-[2.6rem] font-light leading-[1.02] tracking-[-0.04em] sm:text-5xl">Not on the map <span className="font-heading italic text-white/55">yet.</span></h1>
      <p className="text-muted-foreground">That city or place does not exist here. Maybe you are the one to add it.</p>
      <div className="flex justify-center gap-2">
        <Button variant="outline" render={<Link href="/" />}>Home</Button>
        <Button render={<Link href="/submit" />}>Add a place</Button>
      </div>
    </div>
  );
}
