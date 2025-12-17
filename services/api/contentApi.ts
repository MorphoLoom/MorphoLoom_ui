import apiFetch from './apiClient';
import {logger} from '../../utils/logger';
import type {VideoUploadResponse, ImageUploadResponse} from '../../types/api';

/**
 * 비디오 업로드
 * POST /api/v1/content/videos/upload
 */
export const uploadVideo = async (file: any): Promise<VideoUploadResponse> => {
  logger.log('🎥 [uploadVideo] Starting video upload...');
  logger.log('📋 [uploadVideo] File info:', {
    uri: file.uri,
    type: file.type,
    fileName: file.fileName,
  });

  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type || 'video/mp4',
    name: file.fileName || 'video.mp4',
  } as any);

  logger.log('📤 [uploadVideo] Sending request to /content/videos/upload');

  const response = await apiFetch<VideoUploadResponse>('/content/videos/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  });

  logger.log('✅ [uploadVideo] Upload successful:', response);
  return response;
};

/**
 * 이미지 업로드
 * POST /api/v1/content/images/upload
 */
export const uploadImage = async (file: any): Promise<ImageUploadResponse> => {
  logger.log('🖼️ [uploadImage] Starting image upload...');
  logger.log('📋 [uploadImage] File info:', {
    uri: file.uri,
    type: file.type,
    fileName: file.fileName,
  });

  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.type || 'image/png',
    name: file.fileName || 'image.png',
  } as any);

  logger.log('📤 [uploadImage] Sending request to /content/images/upload');

  const response = await apiFetch<ImageUploadResponse>('/content/images/upload', {
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000,
  });

  logger.log('✅ [uploadImage] Upload successful:', response);
  return response;
};

/**
 * 비디오를 갤러리에 저장
*/
export const saveVideoToGallery = async (
  videoPath: string,
): Promise<{success: boolean; message: string}> => {
  try {
    const CameraRoll = require('@react-native-camera-roll/camera-roll')
      .CameraRoll;

    // file:// 프로토콜 제거
    const cleanPath = videoPath.replace('file://', '');

    // 갤러리에 저장
    await CameraRoll.save(cleanPath, {type: 'video'});

    return {
      success: true,
      message: '갤러리에 저장되었습니다',
    };
  } catch (error: any) {
    logger.error('saveVideoToGallery error:', error);
    return {
      success: false,
      message: error.message || '갤러리 저장에 실패했습니다',
    };
  }
};

/**
 * 임시 비디오 파일 삭제
*/
export const deleteTempVideo = async (
  videoPath: string,
): Promise<{success: boolean}> => {
  try {
    const RNFS = require('react-native-fs');

    // file:// 프로토콜 제거
    const cleanPath = videoPath.replace('file://', '');

    // 파일 존재 여부 확인
    const exists = await RNFS.exists(cleanPath);

    if (exists) {
      await RNFS.unlink(cleanPath);
      logger.log('Temp video deleted:', cleanPath);
      return {success: true};
    } else {
      logger.log('Temp video not found:', cleanPath);
      return {success: false};
    }
  } catch (error: any) {
    logger.error('deleteTempVideo error:', error);
    return {success: false};
  }
};
