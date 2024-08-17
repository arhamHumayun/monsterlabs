import { Separator } from '@/components/ui/separator';
import { getCountOfCreatures } from '../../actions';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import CreatureList from '@/components/creature-list';
import SortByCreaturesDropdown from '@/components/sort-by-creatures-dropdown';
import { Input } from '@/components/ui/input';

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

  const pageButtons = () => {
    const buttons = [];

    const minPage = Math.max(2, currentPage - 2);
    const maxPage = Math.min(maxCreaturePage - 1, currentPage + 2);

    for (let i = minPage; i <= maxPage; i++) {
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`/browse/${i}?${searchParamsString}`}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return buttons;
  };

  const paginationSection = (tailwindStyling?: string) => {
    return (
        <Pagination
          className={`my-4 ${tailwindStyling ? tailwindStyling : ''}`}
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  currentPage === 1
                    ? ''
                    : `/browse/${currentPage - 1}?${searchParamsString}`
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/browse/1?${searchParamsString}`}>
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 4 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {pageButtons()}
            {currentPage < maxCreaturePage - 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href={`/browse/${maxCreaturePage}?${searchParamsString}`}
              >
                {maxCreaturePage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={
                  currentPage === maxCreaturePage
                    ? ''
                    : `/browse/${currentPage + 1}?${searchParamsString}`
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex min-h-screen flex-col px-4 sm:px-6 mb-4">
      <h1 className="text-lg font-semibold">All creatures</h1>
      <Separator className="mb-4" />
      <div className="flex justify-between items-center mb-4">
        {paginationSection()}
        <SortByCreaturesDropdown />
      </div>
      <CreatureList
        pageNumber={currentPage}
        sortingOrder={sortingOrder}
        monstersPerPage={monstersPerPage}
      />
      {paginationSection()}
    </div>
  );
}
