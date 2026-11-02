import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="space-y-4 pt-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight">Not on the map yet</h1>
      <p className="text-muted-foreground">That city or place does not exist here. Maybe you are the one to add it.</p>
      <div className="flex justify-center gap-2">
        <Button variant="outline" render={<Link href="/" />}>Home</Button>
        <Button render={<Link href="/submit" />}>Add a place</Button>
      </div>
    </div>
  );
}
