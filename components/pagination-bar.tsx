import { PaginationItem, PaginationLink, Pagination, PaginationContent, PaginationPrevious, PaginationEllipsis, PaginationNext } from "./ui/pagination";

type paginationType = 'items' | 'creatures';

const pageButtons = (searchParamsString: string, currentPage: number, maxPage: number, type: paginationType) => {
  const buttons = [];

  const pageLower = Math.max(2, currentPage - 2);
  const pageUpper = Math.min(maxPage - 1, currentPage + 2);

  console.log({ pageLower, pageUpper });

  for (let i = pageLower; i <= pageUpper; i++) {
    buttons.push(
      <PaginationItem key={i}>
        <PaginationLink
          href={`/browse/${type}/${i}?${searchParamsString}`}
          isActive={currentPage === i}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return buttons;
};

export const paginationSection = (searchParamsString: string, currentPage: number, maxPage: number, type: paginationType, tailwindStyling?: string) => {
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
                  : `/browse/${type}/${currentPage - 1}?${searchParamsString}`
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`/browse/${type}/1?${searchParamsString}`}>
              1
            </PaginationLink>
          </PaginationItem>
          {currentPage > 4 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pageButtons(searchParamsString, currentPage, maxPage, type)}
          {currentPage < maxPage - 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink
              href={`/browse/${type}/${maxPage}?${searchParamsString}`}
            >
              {maxPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href={
                currentPage === maxPage
                  ? ''
                  : `/browse/${type}/${currentPage + 1}?${searchParamsString}`
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
  );
};