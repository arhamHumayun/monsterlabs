import { ThingLink } from '../thing-link';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';

export default async function ItemList({
  pageNumber,
  itemsPerPage,
  sortingOrder,
}: {
  pageNumber: number;
  itemsPerPage: number;
  sortingOrder: 'latest' | 'alphabetical';
}) {
  pageNumber = pageNumber || 1;

  const supabase = await createSupabaseAppServerClient();

  const rangeStart = (pageNumber - 1) * itemsPerPage;
  const rangeEnd = pageNumber * itemsPerPage;

  const orderingColumn = sortingOrder === 'latest' ? 'created_at' : 'name';
  const ascending = sortingOrder === 'alphabetical';

  const { data, error } = await supabase
    .from('items')
    .select(`id, name`)
    .order(orderingColumn, { ascending })
    .range(rangeStart, rangeEnd);

  if (error || !data || data.length === 0) {
    return (
      <div>
        <h1>No items found</h1>
      </div>
    );
  }

  const items = data as {
    id: number;
    name: string;
  }[];

  if (!items || items.length === 0) {
    return (
      <div>
        <h1>No items found</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => {
        return (
          <ThingLink
            key={item.id}
            id={item.id}
            name={item.name}
            thingType="item"
            type="view"
          />
        );
      })}
    </div>
  );
}
