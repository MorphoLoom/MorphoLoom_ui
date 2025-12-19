import {useQuery} from '@tanstack/react-query';
import {fetchCreationRankings} from '../services/api';

// 창작물 랭킹 조회 (단일 페이지, 무한 스크롤 아님)
export const useCreationRankings = () => {
  return useQuery({
    queryKey: ['creations', 'ranking'],
    queryFn: () => fetchCreationRankings(),
    staleTime: 0, // 항상 최신 데이터 조회 (좋아요 반영 즉시 확인)
    gcTime: 5 * 60 * 1000, // 5분간 캐시 보관
  });
};
