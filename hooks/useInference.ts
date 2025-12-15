import {useState} from 'react';
import {showToast} from '../utils/toast';
import {executeInference, getInferenceStatus} from '../services/api/inferenceApi';
import type {
  VideoUploadResponse,
  ImageUploadResponse,
} from '../types/api';

export const useInference = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);

  const handleStart = async (
    uploadedVideoUrl: VideoUploadResponse | null,
    uploadedImageUrl: ImageUploadResponse | null,
    onSuccess?: () => void,
  ) => {
    if (!uploadedVideoUrl || !uploadedImageUrl) {
      showToast.error(
        '업로드 오류',
        '파일 업로드가 완료되지 않았습니다',
        {duration: 3000},
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 추론 서비스 상태 확인
      console.log('Checking inference service status...');
      const statusResult = await getInferenceStatus();
      console.log('Inference status:', statusResult);

      if (!statusResult.success) {
        setIsProcessing(false);
        showToast.error(
          '서비스 사용 불가',
          '추론 서비스를 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
          {duration: 3000},
        );
        return;
      }

      // 2. AI 추론 실행
      console.log('Executing inference...');

      // URL에서 파일명만 추출
      const extractFileName = (url: string) => {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      };

      const sourceFileName = extractFileName(uploadedImageUrl.fileUrl);
      const drivingFileName = extractFileName(uploadedVideoUrl.fileUrl);

      console.log('Source file name:', sourceFileName);
      console.log('Driving file name:', drivingFileName);

      const inferenceResult = await executeInference({
        sourcePath: sourceFileName,
        drivingPath: drivingFileName,
      });

      console.log('Inference result:', inferenceResult);

      setIsProcessing(false);

      if (inferenceResult.success && inferenceResult.resultVideoPath) {
        setResultVideo(inferenceResult.resultVideoPath);

        showToast.success(
          '합성 완료',
          '영상 합성이 완료되었습니다',
          {duration: 2000},
        );

        // 성공 시 콜백 실행 (결과 카드로 이동 등)
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showToast.error(
          '합성 실패',
          inferenceResult.error || '영상 합성에 실패했습니다',
          {duration: 3000},
        );
      }
    } catch (error) {
      console.error('Inference failed:', error);
      setIsProcessing(false);
      showToast.error(
        '합성 실패',
        '영상 합성 중 오류가 발생했습니다',
        {duration: 3000},
      );
    }
  };

  const resetResult = () => {
    setResultVideo(null);
  };

  return {
    isProcessing,
    resultVideo,
    handleStart,
    resetResult,
  };
};
