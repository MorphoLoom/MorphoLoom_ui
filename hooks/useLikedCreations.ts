import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchLikedCreations} from '../services/api/socialApi';

// 좋아요한 창작물 목록 무한 스크롤
export const useLikedCreations = (sort: string = 'latest') => {
  return useInfiniteQuery({
    queryKey: ['creations', 'liked', sort],
    queryFn: ({pageParam = 1}) => fetchLikedCreations(pageParam, 20, sort),
    getNextPageParam: (lastPage, allPages) => {
      // 다음 페이지가 있으면 현재 페이지 + 1 반환
      if (lastPage.items.length === 20) {
        return allPages.length + 1;
      }
      return undefined; // 더 이상 페이지 없음
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};
