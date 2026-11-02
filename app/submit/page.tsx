import { Suspense } from "react";
import { getCities } from "@/lib/queries";
import { PlaceForm } from "@/components/place-form";

export const metadata = { title: "Add a place" };

export default function SubmitPage(props: PageProps<"/submit">) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Add a place</h1>
        <p className="text-muted-foreground">
          A hostel, a farm that takes volunteers, a café with real wifi, a beach club worth the money. Add it once, then
          vote on it as the profile you were.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl border bg-muted/40" />}>
        <FormWithCities searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function FormWithCities({ searchParams }: Pick<PageProps<"/submit">, "searchParams">) {
  const [sp, rows] = await Promise.all([searchParams, getCities()]);
  const cities = rows.map(({ city }) => ({ slug: city.slug, name: city.name, country: city.country }));
  const defaultCity = typeof sp.city === "string" ? sp.city : undefined;
  if (cities.length === 0) return <p className="text-sm text-muted-foreground">No cities yet. Run the seed script first.</p>;
  return <PlaceForm cities={cities} defaultCity={defaultCity} />;
}
