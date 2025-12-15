import apiFetch from './apiClient';
import type {VideoUploadResponse, ImageUploadResponse} from '../../types/api';

/**
 * 비디오 업로드
 * POST /api/v1/content/videos/upload
 */
export const uploadVideo = async (file: any): Promise<VideoUploadResponse> => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type || 'video/mp4',
    name: file.fileName || 'video.mp4',
  } as any);

  return apiFetch('/content/videos/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'X-User-Id': '1',
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 이미지 업로드
 * POST /api/v1/content/images/upload
 */
export const uploadImage = async (file: any): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type || 'image/png',
    name: file.fileName || 'image.png',
  } as any);

  return apiFetch('/content/images/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'X-User-Id': '1',
      'Content-Type': 'multipart/form-data',
    },
  });
};
