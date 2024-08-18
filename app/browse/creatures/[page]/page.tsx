import { Separator } from '@/components/ui/separator';
import { getCountOfCreatures } from '../../../actions';
import CreatureList from '@/components/creature/creature-list';
import SortByDropdown from '@/components/sort-by-dropdown';
import { paginationSection } from '@/components/pagination-bar';

export default async function AllMonsters({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const creatureCount = await getCountOfCreatures();
  const monstersPerPage = 59;
  const sortingOrder =
    (searchParams?.sort as 'latest' | 'alphabetical') || 'latest';

  console.log('searchParams', searchParams);

  const searchParamsString = searchParams
    ? new URLSearchParams(searchParams as any).toString()
    : '';

  console.log('searchParamsString', searchParamsString);

  if (!creatureCount || creatureCount === 0) {
    return (
      <div>
        <h1>No creatures found</h1>
      </div>
    );
  }

  const maxCreaturePage = Math.ceil(creatureCount / monstersPerPage);
  const currentPage = parseInt(params.page, 10) || 1;

  console.log({
    maxCreaturePage,
    currentPage,
  });

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4" />
      <div className="flex justify-between items-center mb-4">
        {paginationSection(
          searchParamsString,
          currentPage,
          maxCreaturePage,
          'creatures'
        )}
        <SortByDropdown />
      </div>
      <CreatureList
        pageNumber={currentPage}
        sortingOrder={sortingOrder}
        monstersPerPage={monstersPerPage}
      />
      {paginationSection(
        searchParamsString,
        currentPage,
        maxCreaturePage,
        'creatures'
      )}
    </div>
  );
}
