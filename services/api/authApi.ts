import apiFetch from './index';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../types/api';

// 로그인
export const login = async (
  request: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  return apiFetch('/auth/login', {
    method: 'POST',
    data: request,
  });
};

// 로그아웃
export const logout = async (): Promise<ApiResponse<{message: string}>> => {
  return apiFetch('/auth/logout', {
    method: 'POST',
  });
};

// 회원가입
export const register = async (
  request: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
  return apiFetch('/auth/register', {
    method: 'POST',
    data: request,
  });
};
