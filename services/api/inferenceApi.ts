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
  request: Omit<InferenceRequest, 'userId'>,
): Promise<InferenceStatusResponse> => {
  const requestBody: InferenceRequest = {
    ...request,
    userId: 1,
  };

  try {
    // RNFS가 설치되어 있는지 확인
    const RNFS = require('react-native-fs');

    // 임시 저장 경로 생성
    const timestamp = Date.now();
    const fileName = `result_${timestamp}.mp4`;
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    console.log('Starting video download to:', downloadDest);

    // 비디오 파일 다운로드
    const downloadResult = await RNFS.downloadFile({
      fromUrl: `${apiClient.defaults.baseURL}/inference/execute`,
      toFile: downloadDest,
      method: 'POST',
      headers: {
        ...apiClient.defaults.headers.common,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      readTimeout: 60000,
      connectionTimeout: 60000,
    }).promise;

    console.log('Download result:', downloadResult);

    if (downloadResult.statusCode === 200) {
      // 성공 시 로컬 파일 경로 반환
      return {
        success: true,
        message: '영상 합성 완료',
        resultVideoPath: `file://${downloadDest}`,
      };
    } else {
      throw new Error(
        `Download failed with status ${downloadResult.statusCode}`,
      );
    }
  } catch (error: any) {
    console.error('executeInference error:', error);

    // RNFS가 없거나 다운로드 실패 시 에러 반환
    return {
      success: false,
      message: '영상 합성 실패',
      error: error.message || '다운로드 중 오류가 발생했습니다',
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
