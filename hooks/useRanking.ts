import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchRankings} from '../services/api';

// 랭킹 목록 무한 스크롤
export const useRankings = (
  period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly',
) => {
  return useInfiniteQuery({
    queryKey: ['ranking', period],
    queryFn: ({pageParam = 1}) => fetchRankings(pageParam, 20, period),
    getNextPageParam: lastPage => {
      const {currentPage, totalPages} = lastPage.data.pagination;
      if (currentPage < totalPages && lastPage.data.rankings.length > 0) {
        return currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 3 * 60 * 1000, // 3분 (랭킹은 좀 더 자주 갱신)
    gcTime: 10 * 60 * 1000,
  });
};
