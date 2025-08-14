'use client';

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

  const rows = 10;
  const monstersPerPage = (3 * rows) - 1;

  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  const currentPage = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1;

  useEffect(() => {
    cachedGetAllData(currentPage, monstersPerPage, sortingOrder).then(
      ({ count, creatures }) => {
        setCreatures(creatures || []);
        setMaxCreaturePage(Math.ceil(count / monstersPerPage));
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, monstersPerPage]);

  return (
    <div>
      <div className="md:flex justify-between items-center mb-4">
        <Suspense fallback={null}>
          {PaginationSection( currentPage, maxCreaturePage - 1, 'creatures')}
        </Suspense>
        {creatures.length > 0 ? <SortByDropdown /> : null}
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
        {PaginationSection( currentPage, maxCreaturePage - 1, 'creatures')}
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
  const supabase = createSupabaseBrowserClient();
  
  // const {
  //   data: profilesData,
  //   error: profilesError,
  // } = await supabase.from('profiles').select('user_id');

  // if (profilesError) {
  //   console.error('Error fetching profiles:', profilesError);
  // }

  // if (!profilesData || profilesData.length === 0) {
  //   return {
  //     count: 0,
  //     error: 'No profiles found',
  //   };
  // }

  // const profileUserIds = profilesData.map((profile) => profile.user_id as string);

  const countPromise = getCountOfCreatures();

  const creaturesListPromise = getCreaturesByPage(
    pageNumber,
    monstersPerPage,
    sortingOrder,
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

async function getCountOfCreatures(profileIds?: string[]): Promise<number> {
  const supabase = createSupabaseBrowserClient();

  const { count, error } = await supabase
    .from('creatures')
    .select('id', { count: 'estimated' })
    // .in('user_id', profileIds)

  if (error || !count) {
    console.error('Error fetching creature count:', error);
    return 0;
  }

  return count;
}

async function getCreaturesByPage(
  pageNumber: number,
  monstersPerPage: number,
  sortingOrder: 'latest' | 'alphabetical',
  profileIds?: string[]
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
    .select(`id, name`, { count: 'exact' })
    // .in('user_id', profileIds)
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
