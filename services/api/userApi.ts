import apiFetch from './index';
import type {
  ApiResponse,
  UserProfileResponse,
  UserSettings,
} from '../../types/api';

// 사용자 프로필 조회
export const fetchUserProfile =
  async (): Promise<ApiResponse<UserProfileResponse>> => {
    return apiFetch('/user/profile');
  };

// 프로필 업데이트
export const updateProfile = async (formData: FormData): Promise<
  ApiResponse<{
    message: string;
    profileImage?: string;
  }>
> => {
  return apiFetch('/user/profile', {
    method: 'PUT',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 설정 업데이트
export const updateSettings = async (
  settings: UserSettings,
): Promise<ApiResponse<{message: string}>> => {
  return apiFetch('/user/settings', {
    method: 'PUT',
    data: settings,
  });
};
