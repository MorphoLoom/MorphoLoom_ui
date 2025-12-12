import {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {Alert} from 'react-native';
import {showToast} from '../utils/toast';
import {
  uploadVideo,
  uploadImage,
  VideoUploadResponse,
  ImageUploadResponse,
} from '../services/api/mock';

interface MediaAsset {
  uri: string;
  type: 'video' | 'image';
}

export const useMediaUpload = () => {
  const [videoAsset, setVideoAsset] = useState<MediaAsset | null>(null);
  const [imageAsset, setImageAsset] = useState<MediaAsset | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] =
    useState<VideoUploadResponse | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] =
    useState<ImageUploadResponse | null>(null);

  const handleMediaPick = async (type: 'video' | 'image') => {
    const result = await launchImageLibrary({
      mediaType: type === 'video' ? 'video' : 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      const selectedFile = result.assets[0];
      console.log('Selected asset:', selectedFile);

      // 업로드 로딩 시작
      if (type === 'video') {
        setIsUploadingVideo(true);
      } else {
        setIsUploadingImage(true);
      }

      try {
        const fileData = {
          uri: selectedFile.uri,
          type: selectedFile.type,
          fileName: selectedFile.fileName,
        };

        // API 업로드
        let uploadResponse;
        if (type === 'video') {
          uploadResponse = await uploadVideo(fileData);
          console.log('Video upload response:', uploadResponse);
          setUploadedVideoUrl(uploadResponse);
        } else {
          uploadResponse = await uploadImage(fileData);
          console.log('Image upload response:', uploadResponse);
          setUploadedImageUrl(uploadResponse);
        }

        // 업로드 성공 후 로컬 상태 업데이트 (미리보기 표시)
        const asset: MediaAsset = {
          uri: selectedFile.uri || '',
          type,
        };

        if (type === 'video') {
          setVideoAsset(asset);
          setIsUploadingVideo(false);
        } else {
          setImageAsset(asset);
          setIsUploadingImage(false);
        }

        // 성공 토스트 표시
        showToast.success(
          '업로드 완료',
          `${type === 'video' ? '비디오' : '이미지'}가 업로드되었습니다`,
          {duration: 3000},
        );
      } catch (error) {
        console.error('Upload failed:', error);

        // 로딩 종료
        if (type === 'video') {
          setIsUploadingVideo(false);
        } else {
          setIsUploadingImage(false);
        }

        showToast.error(
          '업로드 실패',
          `${type === 'video' ? '비디오' : '이미지'} 업로드에 실패했습니다`,
          {duration: 3000},
        );
      }
    }
  };

  const handleDelete = (type: 'video' | 'image') => {
    Alert.alert(
      '삭제 확인',
      `${type === 'video' ? '비디오' : '이미지'}를 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            if (type === 'video') {
              setVideoAsset(null);
              setUploadedVideoUrl(null);
            } else {
              setImageAsset(null);
              setUploadedImageUrl(null);
            }

            // 삭제 토스트 표시
            showToast.info(
              '삭제 완료',
              `${type === 'video' ? '비디오' : '이미지'}가 삭제되었습니다`,
            );
          },
          style: 'destructive',
        },
      ],
    );
  };

  const resetMedia = () => {
    setVideoAsset(null);
    setImageAsset(null);
    setUploadedVideoUrl(null);
    setUploadedImageUrl(null);
  };

  return {
    videoAsset,
    imageAsset,
    isUploadingVideo,
    isUploadingImage,
    uploadedVideoUrl,
    uploadedImageUrl,
    handleMediaPick,
    handleDelete,
    resetMedia,
  };
};
