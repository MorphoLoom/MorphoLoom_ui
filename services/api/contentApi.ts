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

/**
 * 비디오를 갤러리에 저장
 *
 * NOTE: @react-native-camera-roll/camera-roll 라이브러리 필요
 * 설치: npm install @react-native-camera-roll/camera-roll
 *
 * Android: AndroidManifest.xml에 권한 필요
 * <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
 *
 * iOS: Info.plist에 권한 필요
 * <key>NSPhotoLibraryAddUsageDescription</key>
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
    console.error('saveVideoToGallery error:', error);
    return {
      success: false,
      message: error.message || '갤러리 저장에 실패했습니다',
    };
  }
};

/**
 * 임시 비디오 파일 삭제
 *
 * NOTE: react-native-fs 라이브러리 필요
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
      console.log('Temp video deleted:', cleanPath);
      return {success: true};
    } else {
      console.log('Temp video not found:', cleanPath);
      return {success: false};
    }
  } catch (error: any) {
    console.error('deleteTempVideo error:', error);
    return {success: false};
  }
};
