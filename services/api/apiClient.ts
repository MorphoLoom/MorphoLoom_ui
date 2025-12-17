import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL, API_TIMEOUT, ENVIRONMENT} from '@env';

// API 기본 설정 (환경변수에서 로드)
const BASE_URL = API_BASE_URL;
const TIMEOUT = parseInt(API_TIMEOUT || '10000', 10);

console.log('🌐 API Configuration:', {
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  environment: ENVIRONMENT,
});

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중 플래그 (중복 갱신 방지)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 후 대기 중인 요청들에게 새 토큰 전달
const onRefreshed = (token: string) => {
  refreshSubscribers.map(callback => callback(token));
  refreshSubscribers = [];
};

// 토큰 갱신 대기열에 추가
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// 토큰이 필요 없는 엔드포인트 목록
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/signup',
  '/auth/send-verification',
  '/auth/verify-email',
  '/auth/social-login',
  '/auth/password-reset/verify',
];

// Request 인터셉터: 모든 요청에 토큰 자동 추가
apiClient.interceptors.request.use(
  async config => {
    const url = config.url || '';

    // 공개 엔드포인트는 토큰 추가하지 않음
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));

    if (!isPublicEndpoint) {
      // AsyncStorage에서 토큰 가져오기
      const token = await AsyncStorage.getItem('accessToken');

      console.log('🔑 Token check:', token ? `Bearer ${token.substring(0, 20)}...` : 'NO TOKEN');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log('🔓 Public endpoint - no token needed:', url);
      // 공개 엔드포인트는 명시적으로 Authorization 헤더 제거
      delete config.headers.Authorization;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response 인터셉터: 에러 처리
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response) {
      const status = error.response.status;
      const url = originalRequest.url || '';

      // 공개 엔드포인트는 자동 갱신하지 않음
      const isPublicEndpoint = PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));

      // 401 에러: 토큰 만료 (public endpoint 제외)
      if (status === 401 && !originalRequest._retry && !isPublicEndpoint) {
        console.log('🔄 [apiClient] 401 에러 감지 - 토큰 갱신 시작');

        if (isRefreshing) {
          // 이미 토큰 갱신 중이면 대기
          console.log('⏳ [apiClient] 토큰 갱신 대기열에 추가');
          return new Promise(resolve => {
            addRefreshSubscriber((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // AsyncStorage에서 refreshToken 가져오기
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          console.log('🔑 [apiClient] refreshToken:', refreshToken ? 'EXISTS' : 'NOT FOUND');

          if (!refreshToken) {
            // refreshToken이 없으면 로그아웃 처리
            console.log('❌ [apiClient] refreshToken 없음 - 로그아웃');
            await handleLogout();
            return Promise.reject(error);
          }

          // 토큰 갱신 API 호출
          console.log('📡 [apiClient] 토큰 갱신 API 호출:', `${BASE_URL}/auth/refresh`);
          const response = await axios.post(
            `${BASE_URL}/auth/refresh`,
            {refreshToken},
            {
              headers: {'Content-Type': 'application/json'},
            },
          );

          console.log('✅ [apiClient] 토큰 갱신 성공');
          const {accessToken, refreshToken: newRefreshToken} = response.data;

          // 새 토큰 저장
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          // 헤더 업데이트
          apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // 대기 중인 요청들에게 새 토큰 전달
          onRefreshed(accessToken);

          isRefreshing = false;

          console.log('🔄 [apiClient] 원래 요청 재시도:', originalRequest.url);
          // 원래 요청 재시도
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('❌ [apiClient] 토큰 갱신 실패:', refreshError);
          isRefreshing = false;
          refreshSubscribers = [];

          // 토큰 갱신 실패 시 로그아웃 처리
          await handleLogout();
          return Promise.reject(refreshError);
        }
      } else if (status === 403) {
        console.log('⛔ Forbidden - 권한이 없습니다');
      } else if (status === 404) {
        console.log('🔍 Not Found - 리소스를 찾을 수 없습니다');
      } else if (status >= 500) {
        console.log('💥 Server Error - 서버 오류가 발생했습니다');
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.log('Network Error - 네트워크 연결을 확인하세요');
    }

    return Promise.reject(error);
  },
);

// 로그아웃 처리 함수
const handleLogout = async () => {
  try {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    console.log('로그아웃 처리 완료 - 로그인 화면으로 이동');
    // AuthContext의 상태가 변경되면 App.tsx에서 자동으로 LoginScreen으로 이동됨
  } catch (error) {
    console.error('로그아웃 처리 중 오류:', error);
  }
};

// 공통 API 함수
async function apiFetch<T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  try {
    console.log('🔵 API 요청:', endpoint, config?.method, config?.data);
    const response = await apiClient.request<T>({
      url: endpoint,
      ...config,
    });
    console.log('🟢 API 응답:', endpoint, response.status, response.data);
    return response.data;
  } catch (error: any) {
    console.error('🔴 API 에러:', endpoint);
    console.error('에러 전체:', error);
    console.error('에러 response:', error.response);
    console.error('에러 response.data:', error.response?.data);
    console.error('에러 message:', error.message);
    throw error;
  }
}

export default apiFetch;
export {apiClient};
