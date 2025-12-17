import {useMutation, useQueryClient} from '@tanstack/react-query';
import {deleteMyCreation} from '../services/api/socialApi';
import {showToast} from '../utils/toast';
import {logger} from '../utils/logger';

export const useCreationDelete = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (creationId: string) => deleteMyCreation(creationId),
    onSuccess: () => {
      // 모든 관련 캐시 무효화
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
      queryClient.invalidateQueries({queryKey: ['creations', 'liked']});
      queryClient.invalidateQueries({queryKey: ['creations', 'ranking']});
      showToast.success('삭제 완료', '창작물이 삭제되었습니다');
    },
    onError: error => {
      logger.error('Delete error:', error);
      showToast.error('삭제 실패', '창작물 삭제에 실패했습니다');
    },
  });

  return {
    deleteCreation: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
