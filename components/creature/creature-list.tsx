import { ThingLink } from "../thing-link";
import { createSupabaseAppServerClient } from "@/lib/supabase/server-client";
import { creaturesDocument } from "@/types/db/creature";

export default async function CreatureList(
  { 
    pageNumber, 
    monstersPerPage,
    sortingOrder,
  } : 
  { 
    pageNumber: number,
    monstersPerPage: number,
    sortingOrder: "latest" | "alphabetical", 
  },
) {

  pageNumber = pageNumber || 1;

  const supabase = await createSupabaseAppServerClient();

  const rangeStart = (pageNumber - 1) * monstersPerPage;
  const rangeEnd = pageNumber * monstersPerPage;

  const orderingColumn = sortingOrder === 'latest' ? 'created_at' : 'name';
  const ascending = sortingOrder === 'alphabetical';

  const { data, error } = await supabase
    .from('creatures')
    .select(`id, name`)
    .order(orderingColumn, { ascending })
    .range(rangeStart, rangeEnd);

  if (error || !data || data.length === 0) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    );
  }

  const creatures = data as {
    id: number,
    name: string,
  }[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {creatures.map((creature) => {
      return (
        <ThingLink
          key={creature.id}
          id={creature.id}
          name={creature.name}
          thingType='creature'
          type="view"
        />
      );
    })}
  </div>
  )
}