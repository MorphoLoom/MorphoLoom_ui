import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  sendVerification,
  verifyEmail,
  // verifyPasswordResetCode,
  signup,
  login,
  socialLogin,
  logout,
  resetPassword,
  deleteAccount,
} from '../services/api';
import type {
  SendVerificationRequest,
  VerifyEmailRequest,
  RegisterRequest,
  LoginRequest,
  SocialLoginRequest,
  ResetPasswordRequest,
  DeleteAccountRequest,
} from '../types/api';
import {logger} from '../utils/logger';

// 이메일 인증 코드 발송 mutation
export const useSendVerification = () => {
  return useMutation({
    mutationFn: (request: SendVerificationRequest) =>
      sendVerification(request),
    onSuccess: data => {
      logger.log('Verification email sent:', data.message);
    },
  });
};

// 이메일 인증 코드 확인 mutation
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (request: VerifyEmailRequest) => verifyEmail(request),
    onSuccess: data => {
      logger.log('Email verified:', data.message);
    },
  });
};

// // 비밀번호 재설정 인증 코드 확인 mutation
// export const useVerifyPasswordResetCode = () => {
//   return useMutation({
//     mutationFn: (request: VerifyEmailRequest) => verifyPasswordResetCode(request),
//     onSuccess: data => {
//       console.log('Password reset code verified:', data.message);
//     },
//   });
// };

// 회원가입 mutation
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RegisterRequest) => signup(request),
    onSuccess: data => {
      // 토큰을 AsyncStorage에 저장
      logger.log('Signup success:', {
        // accessToken: data.accessToken,
        // refreshToken: data.refreshToken,
        user: data.user,
        isNewUser: data.isNewUser,
      });

      // 사용자 프로필 무효화 (새로 fetch)
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};

// 로그인 mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: data => {
      // 토큰을 AsyncStorage에 저장
      logger.log('Login success:', {
        // accessToken: data.accessToken,
        // refreshToken: data.refreshToken,
        user: data.user,
        isNewUser: data.isNewUser,
      });

      // 사용자 프로필 무효화 (새로 fetch)
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};

// 소셜 로그인 mutation
export const useSocialLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SocialLoginRequest) => socialLogin(request),
    onSuccess: data => {
      // 토큰을 AsyncStorage에 저장
      logger.log('Social login success:', {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        isNewUser: data.isNewUser,
      });

      // 사용자 프로필 무효화 (새로 fetch)
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};

// 로그아웃 mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => logout(refreshToken),
    onSuccess: () => {
      logger.log('Logout success');
      // 모든 캐시 삭제
      queryClient.clear();
    },
  });
};

// 비밀번호 재설정 mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => resetPassword(request),
    onSuccess: data => {
      logger.log('Password reset success:', data.message);
    },
  });
};

// 계정 삭제 mutation
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: DeleteAccountRequest) => deleteAccount(request),
    onSuccess: data => {
      logger.log('Account deleted:', data.message);
      // 모든 캐시 삭제
      queryClient.clear();
    },
  });
};
