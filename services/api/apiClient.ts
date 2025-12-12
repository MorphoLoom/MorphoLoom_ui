import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API 기본 설정 (하드코딩)
const API_BASE_URL = 'http://10.10.110.29:18080/api/v1';
const API_TIMEOUT = 30000;

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터: 모든 요청에 토큰 자동 추가
apiClient.interceptors.request.use(
  async config => {
    // AsyncStorage에서 토큰 가져오기
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const status = error.response.status;

      if (status === 401) {
        // TODO: 토큰 만료 시 로그아웃 처리
        // await AsyncStorage.removeItem('token');
        // NavigationService.navigate('Login');
        console.log('Unauthorized - 로그인이 필요합니다');
      } else if (status === 403) {
        console.log('Forbidden - 권한이 없습니다');
      } else if (status === 404) {
        console.log('Not Found - 리소스를 찾을 수 없습니다');
      } else if (status >= 500) {
        console.log('Server Error - 서버 오류가 발생했습니다');
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.log('Network Error - 네트워크 연결을 확인하세요');
    }

    return Promise.reject(error);
  },
);

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
