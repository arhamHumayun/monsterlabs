'use client';

import { useCallback } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from './ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
type paginationType = 'items' | 'creatures';

export default function PaginationSection(
  currentPage: number,
  maxPage: number,
  type: paginationType
) {

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )

  if (maxPage === 1) {
    return null;
  }

  const buttons = [];

  const pageLower = Math.max(2, currentPage - 1);
  const pageUpper = Math.min(maxPage - 1, currentPage + 1);

  for (let i = pageLower; i <= pageUpper; i++) {
    buttons.push(
      <PaginationItem key={i}>
        <PaginationLink
          onClick={() => {
            router.push(`${pathname}?${createQueryString('page', i.toString())}`);
          }}
          isActive={currentPage === i}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination className={`my-4`}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
          aria-disabled={currentPage === 1}
            onClick={() => {
              router.push(`${pathname}?${createQueryString('page', (Math.max(currentPage-1, 1)).toString())}`);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              router.push(`${pathname}?${createQueryString('page', '1')}`);
            }}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
        {currentPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {buttons}
        {currentPage < maxPage - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              router.push(`${pathname}?${createQueryString('page', (maxPage).toString())}`);
            }}
            isActive={currentPage === maxPage}
          >
            {maxPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            aria-disabled={currentPage === maxPage}
            onClick={() => {
              router.push(`${pathname}?${createQueryString('page', (Math.min(currentPage+1, maxPage)).toString())}`);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
