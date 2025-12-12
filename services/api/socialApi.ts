import apiFetch from './apiClient';
import type {
  ApiResponse,
  SocialFeedResponse,
  LikedVideosResponse,
  Video,
  LikeRequest,
  LikeResponse,
} from '../../types/api';

// 전체 게시물 목록 조회 (공개 갤러리)
export const fetchAllPosts = async (
  page: number = 1,
  limit: number = 20,
  sortBy: 'latest' | 'popular' | 'trending' = 'latest',
): Promise<ApiResponse<SocialFeedResponse>> => {
  return apiFetch(`/social/all?page=${page}&limit=${limit}&sortBy=${sortBy}`);
};

// 좋아요한 게시물 목록 조회
export const fetchLikedPosts = async (
  page: number = 1,
  limit: number = 20,
): Promise<ApiResponse<LikedVideosResponse>> => {
  return apiFetch(`/social/my-likes?page=${page}&limit=${limit}`);
};

// 게시물 상세 정보 조회
export const fetchPostDetail = async (
  videoId: string,
): Promise<ApiResponse<Video>> => {
  return apiFetch(`/social/detail/${videoId}`);
};

// 좋아요 추가
export const likePost = async (
  request: LikeRequest,
): Promise<ApiResponse<LikeResponse>> => {
  return apiFetch('/social/like', {
    method: 'POST',
    data: request,
  });
};

// 좋아요 취소
export const unlikePost = async (
  videoId: string,
): Promise<ApiResponse<LikeResponse>> => {
  return apiFetch(`/social/unlike/${videoId}`, {
    method: 'DELETE',
  });
};
