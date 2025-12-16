import {apiClient} from './apiClient';
import type {
  InferenceRequest,
  InferenceStatusResponse,
} from '../../types/api';

/**
 * AI 추론 실행 및 비디오 파일 다운로드
 * POST /api/v1/inference/execute
 *
 * Response Codes:
 * - 200: 성공 - 비디오 파일 반환
 * - 400: 파라미터 오류
 * - 500: 서버/컨테이너 실행 실패
 *
 * NOTE: react-native-fs 라이브러리 필요
 * 설치: npm install react-native-fs
 */
export const executeInference = async (
  request: InferenceRequest,
): Promise<InferenceStatusResponse> => {
  const requestBody: InferenceRequest = {
    ...request,
  };

  try {
    console.log('🎬 Starting inference...');
    console.log('📦 Request body:', requestBody);

    // POST 요청으로 추론 실행 (JSON 응답 받기)
    const response = await apiClient.post('/inference/execute', requestBody, {
      timeout: 600000, // 10분 (추론 완료까지 대기)
    });

    console.log('✅ Inference response:', response.data);

    // 응답 검증
    if (!response.data.success || !response.data.videoUrl) {
      throw new Error(response.data.error || '비디오 URL을 받지 못했습니다');
    }

    const {videoUrl, thumbnailUrl, message} = response.data;
    console.log('📥 Video URL:', videoUrl);
    console.log('🖼️ Thumbnail URL:', thumbnailUrl);

    // 서버의 videoUrl을 그대로 반환 (다운로드 없이)
    return {
      success: true,
      message: message || '영상 합성 완료',
      resultVideoPath: videoUrl, // 서버 URL 그대로 사용
      thumbnailUrl,
    };
  } catch (error: any) {
    console.error('❌ executeInference error:', error);
    console.error('Error response:', error.response?.data);

    return {
      success: false,
      message: '영상 합성 실패',
      error: error.response?.data?.error || error.message || '처리 중 오류가 발생했습니다',
    };
  }
};

/**
 * AI 추론 상태 확인
 * GET /api/v1/inference/status
 *
 * Response Codes:
 * - 200: 서비스 정상
 * - 503: 사용 불가
 */
export const getInferenceStatus =
  async (): Promise<InferenceStatusResponse> => {
    try {
      const response = await apiClient.get('/inference/status');
      return response.data;
    } catch (error: any) {
      console.error('getInferenceStatus error:', error);
      return {
        success: false,
        message: '서비스 상태 확인 실패',
        error: error.message,
      };
    }
  };
