import {apiClient} from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    // RNFS가 설치되어 있는지 확인
    const RNFS = require('react-native-fs');

    // AsyncStorage에서 토큰 가져오기
    const token = await AsyncStorage.getItem('accessToken');

    // 임시 저장 경로 생성
    const timestamp = Date.now();
    const fileName = `result_${timestamp}.mp4`;
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    console.log('🎬 Starting inference...');
    console.log('📍 Download destination:', downloadDest);
    console.log('🔑 Inference token check:', token ? `Bearer ${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('📦 Request body:', requestBody);

    // 헤더 구성
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const requestUrl = `${apiClient.defaults.baseURL}/inference/execute`;
    console.log('🌐 Request URL:', requestUrl);
    console.log('📋 Request headers:', headers);

    // 비디오 파일 다운로드
    const downloadResult = await RNFS.downloadFile({
      fromUrl: requestUrl,
      toFile: downloadDest,
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      readTimeout: 120000,
      connectionTimeout: 120000,
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
