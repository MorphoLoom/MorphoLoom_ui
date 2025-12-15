import apiFetch from './apiClient';
import type {
  CreationListResponse,
  Creation,
  CreateCreationRequest,
  CreationLikeResponse,
} from '../../types/api';

// ========== 창작물(Creation) 관련 API ==========

// 1. 창작물 목록 조회
export const fetchCreations = async (
  page: number = 1,
  size: number = 20,
  sort: string = 'latest',
): Promise<CreationListResponse> => {
  return apiFetch(`/creations?page=${page}&size=${size}&sort=${sort}`);
};

// 2. 창작물 등록
export const createCreation = async (
  request: CreateCreationRequest,
): Promise<Creation> => {
  return apiFetch('/creations', {
    method: 'POST',
    data: request,
  });
};

// 3. 좋아요 추가 (창작물)
export const likeCreation = async (
  creationId: string,
): Promise<CreationLikeResponse> => {
  return apiFetch(`/creations/${creationId}/like`, {
    method: 'POST',
  });
};

// 4. 좋아요 취소 (창작물)
export const unlikeCreation = async (
  creationId: string,
): Promise<CreationLikeResponse> => {
  return apiFetch(`/creations/${creationId}/like`, {
    method: 'DELETE',
  });
};

// 6. 내 창작물 목록 조회
export const fetchMyCreations = async (
  page: number = 1,
  size: number = 20,
  sort: string = 'latest',
): Promise<CreationListResponse> => {
  return apiFetch(`/creations/my?page=${page}&size=${size}&sort=${sort}`);
};

// 7. 내 창작물 삭제
export const deleteMyCreation = async (creationId: string): Promise<void> => {
  return apiFetch(`/creations/my/${creationId}`, {
    method: 'DELETE',
  });
};
