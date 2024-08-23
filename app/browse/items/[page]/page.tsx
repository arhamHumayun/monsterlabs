import { Separator } from '@/components/ui/separator';
import SortByDropdown from '@/components/sort-by-dropdown';
import { paginationSection } from '@/components/pagination-bar';
import { ThingLink } from '@/components/thing-link';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { cache } from 'react';

export default async function AllItems({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const itemsPerPage = 29;

  const { count, items: data, error: itemsError } = await getCachedData(
    parseInt(params.page, 10) || 1,
    itemsPerPage,
    searchParams?.sort as 'latest' | 'alphabetical'
  );

  if (itemsError || !data || data.length === 0) {
    console.error('Error fetching item count:', itemsError);
    return(
      <div>
      <h1>No items found</h1>
    </div>
    );
  } 
  
  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  const searchParamsString = searchParams
    ? new URLSearchParams(searchParams as any).toString()
    : '';

  const maxItemPage = Math.ceil(count / itemsPerPage);
  const currentPage = parseInt(params.page, 10) || 1;

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All items</h1>
      <Separator className="mb-4" />
      <div className="md:flex justify-between items-center mb-4">
        {paginationSection(searchParamsString, currentPage, maxItemPage, 'items')}
        <SortByDropdown />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {data.map((item) => {
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
      {paginationSection(searchParamsString, currentPage, maxItemPage, 'items')}
    </div>
  );
}

const getCachedData = cache(getAllData);

async function getAllData(
  pageNumber: number,
  itemsPerPage: number,
  sortingOrder: 'latest' | 'alphabetical'
): Promise<{
  count: number;
  items?: {
    id: number;
    name: string;
  }[];
  error?: any;
}> {
  const countPromise = getCountOfItems();

  const itemsPromise = getItemsByPage(
    pageNumber,
    itemsPerPage,
    sortingOrder
  );

  const [count, itemsResponse] = await Promise.all([
    countPromise,
    itemsPromise,
  ]);

  const { data, error } = itemsResponse;

  if (error || !data || data.length === 0) {
    return {
      count,
      error,
    };
  }

  const items = data as {
    id: number;
    name: string;
  }[];

  return {
    count,
    items,
  };
}

async function getCountOfItems() {

  const supabase = await createSupabaseAppServerClient();

  const { count, error } = await supabase
  .from('items')
  .select('id', { count: 'estimated' });

  if (error || !count) {
    console.error('Error fetching item count:', error);
    return 1;
  }

  return count;
}

async function getItemsByPage(
  pageNumber: number,
  itemsPerPage: number,
  sortingOrder: 'latest' | 'alphabetical'
): Promise<{
  data?: {
    id: number;
    name: string;
  }[];
  error?: any;
}> {
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
    return {
      error,
    };
  }

  const items = data as {
    id: number;
    name: string;
  }[];

  return {
    data: items,
  };
}