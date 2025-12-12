import apiFetch from './apiClient';
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
} from '../../types/api';

// 이메일 인증 코드 발송
export const sendVerification = async (
  request: SendVerificationRequest,
): Promise<SendVerificationResponse> => {
  return apiFetch('/auth/send-verification', {
    method: 'POST',
    data: request,
  });
};

// 이메일 인증 코드 확인
export const verifyEmail = async (
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> => {
  return apiFetch('/auth/verify-email', {
    method: 'POST',
    data: request,
  });
};

// // 비밀번호 재설정 인증 코드 확인
// export const verifyPasswordResetCode = async (
//   request: VerifyEmailRequest,
// ): Promise<VerifyEmailResponse> => {
//   return apiFetch('/auth/password-reset/send-code', {
//     method: 'POST',
//     data: request,
//   });
// };

// 회원가입
export const signup = async (
  request: RegisterRequest,
): Promise<RegisterResponse> => {
  return apiFetch('/auth/signup', {
    method: 'POST',
    data: request,
  });
};

// 로그인
export const login = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  return apiFetch('/auth/login', {
    method: 'POST',
    data: request,
  });
};

// 소셜 로그인
export const socialLogin = async (
  request: SocialLoginRequest,
): Promise<SocialLoginResponse> => {
  return apiFetch('/auth/social-login', {
    method: 'POST',
    data: request,
  });
};

// 로그아웃
export const logout = async (refreshToken: string): Promise<{message: string}> => {
  return apiFetch('/auth/logout', {
    method: 'POST',
    data: { refreshToken },
  });
};

// 비밀번호 재설정
export const resetPassword = async (
  request: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
  console.log('Resetting password with request:', request);
  return apiFetch('/auth/password-reset/verify', {
    method: 'POST',
    data: request,
  });
};
