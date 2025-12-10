import {useInfiniteQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  fetchAllPosts,
  fetchLikedPosts,
  fetchPostDetail,
  likePost,
  unlikePost,
} from '../services/api/socialApi';
import type {LikeRequest} from '../types/api';

// 전체 게시물 무한 스크롤
export const useAllPosts = (
  sortBy: 'latest' | 'popular' | 'trending' = 'latest',
) => {
  return useInfiniteQuery({
    queryKey: ['social', 'all', sortBy],
    queryFn: ({pageParam = 1}) => fetchAllPosts(pageParam, 20, sortBy),
    getNextPageParam: lastPage => {
      const {currentPage, totalPages} = lastPage.data.pagination;
      // 다음 페이지가 있고 데이터가 있으면 다음 페이지 번호 반환
      if (currentPage < totalPages && lastPage.data.videos.length > 0) {
        return currentPage + 1;
      }
      return undefined; // 더 이상 페이지 없음
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (구 cacheTime)
  });
};

// 좋아요한 게시물 무한 스크롤
export const useLikedPosts = () => {
  return useInfiniteQuery({
    queryKey: ['social', 'liked'],
    queryFn: ({pageParam = 1}) => fetchLikedPosts(pageParam, 20),
    getNextPageParam: lastPage => {
      const {currentPage, totalPages} = lastPage.data.pagination;
      if (currentPage < totalPages && lastPage.data.likedVideos.length > 0) {
        return currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 게시물 상세 조회 (단일 조회는 useQuery 사용)
export const usePostDetail = (videoId: string) => {
  return useInfiniteQuery({
    queryKey: ['social', 'detail', videoId],
    queryFn: () => fetchPostDetail(videoId),
    enabled: !!videoId, // videoId가 있을 때만 실행
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 1,
    getNextPageParam: () => undefined, // 단일 페이지이므로 다음 페이지 없음
  });
};

// 좋아요 추가 mutation
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LikeRequest) => likePost(request),
    onSuccess: (data, variables) => {
      // 전체 게시물 목록 무효화 (다시 fetch)
      queryClient.invalidateQueries({queryKey: ['social', 'all']});
      // 좋아요 목록 무효화
      queryClient.invalidateQueries({queryKey: ['social', 'liked']});
      // 해당 게시물 상세 무효화
      queryClient.invalidateQueries({
        queryKey: ['social', 'detail', variables.videoId],
      });
    },
  });
};

// 좋아요 취소 mutation
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => unlikePost(videoId),
    onSuccess: (data, videoId) => {
      queryClient.invalidateQueries({queryKey: ['social', 'all']});
      queryClient.invalidateQueries({queryKey: ['social', 'liked']});
      queryClient.invalidateQueries({
        queryKey: ['social', 'detail', videoId],
      });
    },
  });
};
