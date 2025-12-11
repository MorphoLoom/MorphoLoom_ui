// AI 추론 API

import axios from 'axios';
import {InferenceRequest, InferenceStatusResponse} from './types';

// 환경변수 fallback
const API_BASE_URL = 'http://10.10.110.29:18888/api/v1';

/**
 * AI 추론 실행
 * POST /api/v1/inference/execute
 *
 * Response Codes:
 * - 200: 성공
 * - 400: 파라미터 오류
 * - 500: 서버/컨테이너 실행 실패
 */
export const executeInference = async (
  request: Omit<InferenceRequest, 'userId'>,
): Promise<InferenceStatusResponse> => {
  const requestBody: InferenceRequest = {
    ...request,
    userId: 1,
  };

  const response = await axios.post<InferenceStatusResponse>(
    `${API_BASE_URL}/inference/execute`,
    requestBody,
  );

  return response.data;
};

/**
 * AI 추론 상태 확인
 * GET /api/v1/inference/status
 *
 * Response Codes:
 * - 200: 서비스 정상
 * - 503: 사용 불가
 */
export const getInferenceStatus = async (): Promise<InferenceStatusResponse> => {
  const response = await axios.get<InferenceStatusResponse>(
    `${API_BASE_URL}/inference/status`,
  );

  return response.data;
};
