'use client';

import { Separator } from '@/components/ui/separator';
import SortByDropdown from '@/components/sort-by-dropdown';
import { ThingLink } from '@/components/thing-link';
import { cache, Suspense, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import PaginationSection from '@/components/pagination-section';

export default function AllMonsters({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [creatures, setCreatures] = useState<{ id: number; name: string }[]>(
    []
  );
  const [maxCreaturePage, setMaxCreaturePage] = useState<number>(1);

  const monstersPerPage = 29;

  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  const currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;

  useEffect(() => {
    cachedGetAllData(currentPage, monstersPerPage, sortingOrder).then(
      ({ count, creatures, error }) => {
        setCreatures(creatures || []);
        setMaxCreaturePage(Math.ceil(count / monstersPerPage));
      }
    );
  }, [currentPage, sortingOrder]);

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4" />
      <div className="md:flex justify-between items-center mb-4">
        <Suspense fallback={null}>
          {PaginationSection(
            currentPage ? currentPage : 1,
            maxCreaturePage,
            'creatures'
          )}
        </Suspense>
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
      <Suspense fallback={null}>
        {PaginationSection(
          currentPage ? currentPage : 1,
          maxCreaturePage,
          'creatures'
        )}
      </Suspense>
    </div>
  );
}

const cachedGetAllData = cache(getAllData);

async function getAllData(
  pageNumber: number,
  monstersPerPage: number,
  sortingOrder: 'latest' | 'alphabetical'
): Promise<{
  count: number;
  creatures?: { id: number; name: string }[];
  error?: any;
}> {
  const countPromise = getCountOfCreatures();

  const creaturesListPromise = getCreaturesByPage(
    pageNumber,
    monstersPerPage,
    sortingOrder
  );

  const [countResults, creaturesListResults] = await Promise.allSettled([
    countPromise,
    creaturesListPromise,
  ]);

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
  const supabase = createSupabaseBrowserClient();

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
  const supabase = createSupabaseBrowserClient();

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
