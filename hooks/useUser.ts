import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  fetchUserProfile,
  updateProfile,
  updateSettings,
} from '../services/api';
import type {UserSettings} from '../types/api';

// 사용자 프로필 조회
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: fetchUserProfile,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  });
};

// 프로필 업데이트 mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfile(formData),
    onSuccess: () => {
      // 프로필 정보 다시 fetch
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};

// 설정 업데이트 mutation
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: UserSettings) => updateSettings(settings),
    onSuccess: () => {
      // 프로필 정보 다시 fetch
      queryClient.invalidateQueries({queryKey: ['user', 'profile']});
    },
  });
};
