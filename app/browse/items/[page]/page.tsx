import { Separator } from '@/components/ui/separator';
import SortByDropdown from '@/components/sort-by-dropdown';
import ItemList from '@/components/item/item-list';
import { paginationSection } from '@/components/pagination-bar';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser-client';

export default async function AllItems({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const itemsPerPage = 29;

  const supabase = createSupabaseBrowserClient();

  const { count, error } = await supabase
    .from('items')
    .select('id', { count: 'estimated' });

  if (error) {
    console.error('Error fetching item count:', error);
    return;
  } 
  
  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  const searchParamsString = searchParams
    ? new URLSearchParams(searchParams as any).toString()
    : '';

  if (!count || count === 0) {
    return (
      <div>
        <h1>No items found</h1>
      </div>
    );
  }

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
      <ItemList // Update the component to ItemList
        pageNumber={currentPage}
        sortingOrder={sortingOrder}
        itemsPerPage={itemsPerPage} // Update the variable name to itemsPerPage
      />
      {paginationSection(searchParamsString, currentPage, maxItemPage, 'items')}
    </div>
  );
}
