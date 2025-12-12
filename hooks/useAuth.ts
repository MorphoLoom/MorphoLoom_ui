import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {login, logout, register} from '../services/api';
import type {LoginRequest, RegisterRequest} from '../types/api';

// 로그인 mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: data => {
      // TODO: 토큰을 AsyncStorage에 저장
      console.log('Login success:', data.data.token);

      // 사용자 프로필 무효화 (새로 fetch)
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};

// 로그아웃 mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // TODO: AsyncStorage에서 토큰 삭제

      // 모든 캐시 삭제
      queryClient.clear();
    },
  });
};

// 회원가입 mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (request: RegisterRequest) => register(request),
  });
};
