import { HeaderSkeleton, ListSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="space-y-8">
      <HeaderSkeleton />
      <ListSkeleton />
    </div>
  );
}
