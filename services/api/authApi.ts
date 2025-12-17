import apiFetch from './apiClient';
import {logger} from '../../utils/logger';
import type {
  SendVerificationRequest,
  SendVerificationResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  SocialLoginRequest,
  SocialLoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
} from '../../types/api';

// 이메일 인증 코드 발송
export const sendVerification = async (
  request: SendVerificationRequest,
): Promise<SendVerificationResponse> => {
  return apiFetch('/auth/send-verification', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};

// 이메일 인증 코드 확인
export const verifyEmail = async (
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  return apiFetch('/auth/verify-email', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};

// 회원가입
export const signup = async (
  request: RegisterRequest,
): Promise<RegisterResponse> => {
  return apiFetch('/auth/signup', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};

// 로그인
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  return apiFetch('/auth/login', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};

// 소셜 로그인
export const socialLogin = async (
  request: SocialLoginRequest,
): Promise<SocialLoginResponse> => {
  return apiFetch('/auth/social-login', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};

// 로그아웃
export const logout = async (
  refreshToken: string,
): Promise<{message: string}> => {
  return apiFetch('/auth/logout', {
    method: 'POST',
    data: {refreshToken},
    timeout: 10000,
  });
};

// 비밀번호 재설정
export const resetPassword = async (
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  logger.log('Resetting password with request:', request);
  return apiFetch('/auth/password-reset/verify', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};

// 토큰 갱신
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<LoginResponse> => {
  return apiFetch('/auth/refresh', {
    method: 'POST',
    data: {refreshToken},
    timeout: 10000,
  });
};

// 계정 삭제
export const deleteAccount = async (
  request: DeleteAccountRequest,
): Promise<DeleteAccountResponse> => {
  return apiFetch('/auth/delete-account', {
    method: 'POST',
    data: request,
    timeout: 10000,
  });
};
