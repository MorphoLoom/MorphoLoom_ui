import apiFetch from './apiClient';
import type {Creation} from '../../types/api';

// 5. 창작물 랭킹 조회
export const fetchCreationRankings = async (): Promise<Creation[]> => {
  return apiFetch('/creations/ranking');
};
