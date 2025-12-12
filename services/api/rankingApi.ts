import apiFetch from './apiClient';
import type {ApiResponse, RankingResponse} from '../../types/api';

// 랭킹 목록 조회
export const fetchRankings = async (
  page: number = 1,
  limit: number = 20,
  period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly',
): Promise<ApiResponse<RankingResponse>> => {
  return apiFetch(
    `/ranking/list?page=${page}&limit=${limit}&period=${period}`,
  );
};
