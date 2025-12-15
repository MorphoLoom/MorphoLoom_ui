import {useQuery} from '@tanstack/react-query';
import {fetchCreationRankings} from '../services/api';

// 창작물 랭킹 조회 (단일 페이지, 무한 스크롤 아님)
export const useCreationRankings = () => {
  return useQuery({
    queryKey: ['creations', 'ranking'],
    queryFn: () => fetchCreationRankings(),
    staleTime: 3 * 60 * 1000, // 3분 (랭킹은 좀 더 자주 갱신)
    gcTime: 10 * 60 * 1000,
  });
};
