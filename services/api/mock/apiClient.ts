// Mock API 전용 Axios 인스턴스

import axios from 'axios';

// 환경변수 fallback
const API_BASE_URL = 'http://10.10.110.29:18888/api/v1';

// Mock API 공통 Axios 인스턴스
export const mockApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 기본 timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
