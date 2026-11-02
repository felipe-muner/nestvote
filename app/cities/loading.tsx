import { CardGridSkeleton, HeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <HeaderSkeleton />
      <CardGridSkeleton count={6} cols="sm:grid-cols-2 lg:grid-cols-3" />
    </div>
  );
}
