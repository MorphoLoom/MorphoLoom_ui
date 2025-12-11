// 이미지·비디오 관리 API

import axios from 'axios';
import {VideoUploadResponse, ImageUploadResponse} from './types';

// 환경변수 fallback
const API_BASE_URL = 'http://10.10.110.29:18888/api/v1';

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

  const response = await axios.post<VideoUploadResponse>(
    `${API_BASE_URL}/content/videos/upload`,
    formData,
    {
      headers: {
        'X-User-Id': '1',
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
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

  const response = await axios.post<ImageUploadResponse>(
    `${API_BASE_URL}/content/images/upload`,
    formData,
    {
      headers: {
        'X-User-Id': '1',
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
