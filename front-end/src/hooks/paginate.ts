import { useState } from 'react';

interface usePaginateProps {
  initialLimit: number;
  initialPage: number;
}

export const usePaginate = ({ initialLimit, initialPage }: usePaginateProps) => {
  const [limit, setLimit] = useState<number>(initialLimit);
  const [page, setPage] = useState<number>(initialPage);
  // console.log("ewr");
  
  return {
    limit,
    page,
    setLimit,
    setPage,
  };
};
