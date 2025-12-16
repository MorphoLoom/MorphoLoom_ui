import {useMutation} from '@tanstack/react-query';
import {likeCreation, unlikeCreation} from '../services/api/socialApi';

export const useCreationLike = (creationId: string) => {
  const likeMutation = useMutation({
    mutationFn: () => likeCreation(creationId),
    onError: error => {
      console.error('Like error:', error);
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeCreation(creationId),
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
