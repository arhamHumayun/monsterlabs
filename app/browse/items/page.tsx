'use client';

import { Separator } from '@/components/ui/separator';
import SortByDropdown from '@/components/sort-by-dropdown';
import { ThingLink } from '@/components/thing-link';
import { cache, Suspense, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import PaginationSection from '@/components/pagination-section';

export default function AllItems({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [data, setData] = useState<{ id: number; name: string }[]>([]);
  const [maxItemPage, setMaxItemPage] = useState<number>(1);

  const itemsPerPage = 29;

  const currentPage =
    typeof searchParams?.page === 'string'
      ? parseInt(searchParams.page, 10)
      : 1;

  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  useEffect(() => {
    getCachedData(currentPage, itemsPerPage, sortingOrder).then(
      ({ count, items, error }) => {
        if (error || !items) {
          console.error('Error fetching items:', error);
          return;
        }
        setData(items);
        setMaxItemPage(Math.ceil(count / itemsPerPage));
      }
    );
  }, [currentPage, sortingOrder]);


  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All items</h1>
      <Separator className="mb-4" />
      <div className="md:flex justify-between items-center mb-4">
        <Suspense fallback={null}>
          {PaginationSection(currentPage, maxItemPage, 'items')}
        </Suspense>
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
      <Suspense fallback={null}>
        {PaginationSection(currentPage, maxItemPage, 'items')}
      </Suspense>
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

  const itemsPromise = getItemsByPage(pageNumber, itemsPerPage, sortingOrder);

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
  const supabase = createSupabaseBrowserClient();

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
  const supabase = await createSupabaseBrowserClient();

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
