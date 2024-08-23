import { Separator } from '@/components/ui/separator';
import SortByDropdown from '@/components/sort-by-dropdown';
import { paginationSection } from '@/components/pagination-bar';
import { createSupabaseAppServerClient } from '@/lib/supabase/server-client';
import { ThingLink } from '@/components/thing-link';
import { cache } from 'react';

export default async function AllMonsters({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const monstersPerPage = 29;

  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  const searchParamsString = searchParams
    ? new URLSearchParams(searchParams as any).toString()
    : '';

  const { count, creatures, error } = await cachedGetAllData(
    parseInt(params.page, 10) || 1,
    monstersPerPage,
    sortingOrder
  );

  if (!count || count === 0 || error || !creatures || creatures.length === 0) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    );
  }

  const maxCreaturePage = Math.ceil(count / monstersPerPage);
  const currentPage = parseInt(params.page, 10) || 1;

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4" />
      <div className="md:flex justify-between items-center mb-4">
        {paginationSection(
          searchParamsString,
          currentPage,
          maxCreaturePage,
          'creatures'
        )}
        <SortByDropdown />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {creatures.map((creature) => {
        return (
          <ThingLink
            key={creature.id}
            id={creature.id}
            name={creature.name}
            thingType="creature"
            type="view"
          />
        );
      })}
    </div>
      {paginationSection(
        searchParamsString,
        currentPage,
        maxCreaturePage,
        'creatures'
      )}
    </div>
  );
}

const cachedGetAllData = cache(getAllData);

async function getAllData(
  pageNumber: number,
  monstersPerPage: number,
  sortingOrder: 'latest' | 'alphabetical'
) : Promise<{
  count: number;
  creatures?: { id: number; name: string }[];
  error?: any;
}>
{

  const countPromise = getCountOfCreatures();

  const creaturesListPromise = getCreaturesByPage(
    pageNumber,
    monstersPerPage,
    sortingOrder
  );

  const [countResults, creaturesListResults] = await Promise.allSettled([countPromise, creaturesListPromise]);

  const count = countResults.status === 'fulfilled' ? countResults.value : 1;

  if (creaturesListResults.status === 'rejected') {
    return {
      count,
      error: creaturesListResults.reason,
    };
  }

  const { data, error: creaturesError } = creaturesListResults.value;

  if (creaturesError || !data || data.length === 0) {
    return {
      count,
      error: creaturesError,
    };
  }

  return {
    count,
    creatures: data,
  };
}

async function getCountOfCreatures(): Promise<number> {
  const supabase = await createSupabaseAppServerClient();

  const { count, error } = await supabase
    .from('creatures')
    .select('id', { count: 'estimated' });

  if (error || !count) {
    console.error('Error fetching creature count:', error);
    return 0;
  }
  
  return count;
}

async function getCreaturesByPage(
  pageNumber: number,
  monstersPerPage: number,
  sortingOrder: 'latest' | 'alphabetical'
): Promise<{
  data?: {
    id: number;
    name: string;
  }[];
  error?: any;
}> {
  const supabase = await createSupabaseAppServerClient();

  const orderingColumn = sortingOrder === 'latest' ? 'created_at' : 'name';
  const ascending = sortingOrder === 'alphabetical';

  const rangeStart = (pageNumber - 1) * monstersPerPage;
  const rangeEnd = pageNumber * monstersPerPage;

  const { data, error } = await supabase
    .from('creatures')
    .select(`id, name`)
    .order(orderingColumn, { ascending })
    .range(rangeStart, rangeEnd);

  if (error) {
    console.error('Error fetching creatures:', error);
    return {
      error,
    };
  }

  return {
    data: data as { id: number; name: string }[],
  };
}
