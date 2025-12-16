import {useMutation, useQueryClient} from '@tanstack/react-query';
import {likeCreation, unlikeCreation} from '../services/api/socialApi';

export const useCreationLike = (creationId: string) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likeCreation(creationId),
    onSuccess: () => {
      // 해당 창작물 상세 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['creation', creationId]});
      // 전체 창작물 목록 캐시 무효화 (queryKey: ['creations', 'all', sort])
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      // 내 창작물 목록 캐시 무효화 (queryKey: ['creations', 'my', sort])
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
      // 좋아요한 창작물 목록 캐시 무효화 (queryKey: ['creations', 'liked', sort])
      queryClient.invalidateQueries({queryKey: ['creations', 'liked']});
    },
    onError: error => {
      console.error('Like error:', error);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeCreation(creationId),
    onSuccess: () => {
      // 해당 창작물 상세 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['creation', creationId]});
      // 전체 창작물 목록 캐시 무효화 (queryKey: ['creations', 'all', sort])
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      // 내 창작물 목록 캐시 무효화 (queryKey: ['creations', 'my', sort])
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
      // 좋아요한 창작물 목록 캐시 무효화 (queryKey: ['creations', 'liked', sort])
      queryClient.invalidateQueries({queryKey: ['creations', 'liked']});
    },
    onError: error => {
      console.error('Unlike error:', error);
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
};
