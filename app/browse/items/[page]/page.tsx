import { Separator } from '@/components/ui/separator';
import { getCountOfItems } from '@/app/actions';
import SortByDropdown from '@/components/sort-by-dropdown';
import ItemList from '@/components/item/item-list';
import { paginationSection } from '@/components/pagination-bar';

export default async function AllItems({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const itemCount = await getCountOfItems(); // Update the function call to getCountOfItems
  const itemsPerPage = 59; // Update the variable name to itemsPerPage
  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  const searchParamsString = searchParams
    ? new URLSearchParams(searchParams as any).toString()
    : '';

  if (!itemCount || itemCount === 0) { // Update the variable name to itemCount
    return (
      <div>
        <h1>No items found</h1>
      </div>
    );
  }

  const maxItemPage = Math.ceil(itemCount / itemsPerPage); // Update the variable name to maxItemPage
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
