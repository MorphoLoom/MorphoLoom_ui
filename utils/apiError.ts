import {AxiosError} from 'axios';
import type {ApiError, ApiErrorCode} from '../types/api';
import {API_ERROR_MESSAGES} from '../types/api';

/**
 * 커스텀 API 에러 클래스
 * axios 에러를 표준화된 형태로 변환
 */
export class AppApiError extends Error {
  code: ApiErrorCode;
  status: number;
  originalMessage?: string;
  details?: Record<string, any>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'AppApiError';
    this.code = error.code;
    this.status = error.status;
    this.originalMessage = error.originalMessage;
    this.details = error.details;
  }

  /**
   * 사용자에게 표시할 메시지 반환
   */
  getUserMessage(): string {
    return this.message;
  }

  /**
   * 에러가 특정 코드인지 확인
   */
  isCode(code: ApiErrorCode): boolean {
    return this.code === code;
  }

  /**
   * 재시도 가능한 에러인지 확인
   */
  isRetryable(): boolean {
    return ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR'].includes(this.code);
  }
}

/**
 * HTTP 상태 코드를 ApiErrorCode로 변환
 */
function getErrorCodeFromStatus(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    default:
      if (status >= 500) {
        return 'SERVER_ERROR';
      }
      return 'UNKNOWN';
  }
}

/**
 * Axios 에러를 표준화된 ApiError로 변환
 */
export function normalizeError(error: unknown): AppApiError {
  // 이미 AppApiError인 경우
  if (error instanceof AppApiError) {
    return error;
  }

  // Axios 에러인 경우
  if (error instanceof AxiosError) {
    // 타임아웃
    if (error.code === 'ECONNABORTED') {
      return new AppApiError({
        code: 'TIMEOUT',
        status: 0,
        message: API_ERROR_MESSAGES.TIMEOUT,
      });
    }

    // 네트워크 에러 (응답 없음)
    if (!error.response) {
      return new AppApiError({
        code: 'NETWORK_ERROR',
        status: 0,
        message: API_ERROR_MESSAGES.NETWORK_ERROR,
      });
    }

    // HTTP 에러 응답
    const status = error.response.status;
    const code = getErrorCodeFromStatus(status);
    const serverMessage = error.response.data?.message || error.response.data?.error;

    return new AppApiError({
      code,
      status,
      message: serverMessage || API_ERROR_MESSAGES[code],
      originalMessage: serverMessage,
      details: error.response.data,
    });
  }

  // 일반 Error인 경우
  if (error instanceof Error) {
    return new AppApiError({
      code: 'UNKNOWN',
      status: 0,
      message: error.message || API_ERROR_MESSAGES.UNKNOWN,
      originalMessage: error.message,
    });
  }

  // 그 외
  return new AppApiError({
    code: 'UNKNOWN',
    status: 0,
    message: API_ERROR_MESSAGES.UNKNOWN,
  });
}

/**
 * 에러인지 확인하는 타입 가드
 */
export function isApiError(error: unknown): error is AppApiError {
  return error instanceof AppApiError;
}

/**
 * 특정 에러 코드인지 확인
 */
export function isErrorCode(error: unknown, code: ApiErrorCode): boolean {
  return isApiError(error) && error.code === code;
}
