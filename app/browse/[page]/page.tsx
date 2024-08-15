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

export default async function AllMonsters({
  params,
}: {
  params: { page: string };
}) {
  const creatureCount = await getCountOfCreatures();
  const monstersPerPage = 89;

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
          <PaginationLink href={`/browse/${i}`} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return buttons;
  };

  const paginationSection = () => {
    return (
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage === 1 ? '' : `/browse/${currentPage - 1}`}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`/browse/1`}>1</PaginationLink>
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
            <PaginationLink href={`/browse/${maxCreaturePage}`}>
              {maxCreaturePage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                currentPage === maxCreaturePage
                  ? ''
                  : `/browse/${currentPage + 1}`
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
      {paginationSection()}
      <CreatureList
        pageNumber={currentPage}
        monstersPerPage={monstersPerPage}
      />
      {paginationSection()}
    </div>
  );
}
