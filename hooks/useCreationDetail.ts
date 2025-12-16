import {useQuery} from '@tanstack/react-query';
import {fetchCreationDetail} from '../services/api/socialApi';

export const useCreationDetail = (creationId: string) => {
  return useQuery({
    queryKey: ['creation', creationId],
    queryFn: () => fetchCreationDetail(creationId),
    enabled: !!creationId, // creationId가 있을 때만 쿼리 실행
  });
};
