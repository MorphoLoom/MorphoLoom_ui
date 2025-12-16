import {useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  fetchCreations,
  createCreation,
  likeCreation,
  unlikeCreation,
  fetchMyCreations,
  deleteMyCreation,
} from '../services/api';
import type {CreateCreationRequest} from '../types/api';

// 창작물 목록 무한 스크롤
export const useCreations = (sort: string = 'latest') => {
  return useInfiniteQuery({
    queryKey: ['creations', 'all', sort],
    queryFn: ({pageParam = 1}) => fetchCreations(pageParam, 20, sort),
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

// 내 창작물 목록 무한 스크롤
export const useMyCreations = (sort: string = 'latest') => {
  return useInfiniteQuery({
    queryKey: ['creations', 'my', sort],
    queryFn: ({pageParam = 1}) => fetchMyCreations(pageParam, 20, sort),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length === 20) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 창작물 등록 mutation
export const useCreateCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCreationRequest) => createCreation(request),
    onSuccess: () => {
      // 전체 창작물 목록 무효화
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      // 내 창작물 목록 무효화
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
    },
  });
};

// 좋아요 추가 mutation
export const useLikeCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (creationId: string) => likeCreation(creationId),
    onSuccess: () => {
      // 전체 창작물 목록 무효화
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      // 내 창작물 목록 무효화
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
      // 랭킹 무효화 (좋아요 수가 바뀌면 랭킹도 영향)
      queryClient.invalidateQueries({queryKey: ['creations', 'ranking']});
    },
  });
};

// 좋아요 취소 mutation
export const useUnlikeCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (creationId: string) => unlikeCreation(creationId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
      queryClient.invalidateQueries({queryKey: ['creations', 'ranking']});
    },
  });
};

// 내 창작물 삭제 mutation
export const useDeleteMyCreation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (creationId: string) => deleteMyCreation(creationId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['creations', 'all']});
      queryClient.invalidateQueries({queryKey: ['creations', 'my']});
      queryClient.invalidateQueries({queryKey: ['creations', 'liked']});
      queryClient.invalidateQueries({queryKey: ['creations', 'ranking']});
    },
  });
};
