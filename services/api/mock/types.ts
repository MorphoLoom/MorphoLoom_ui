// Mock API 타입 정의

export interface VideoUploadResponse {
  videoId: string;
  fileUrl: string;
  createdAt: string;
}

export interface ImageUploadResponse {
  imageId: string;
  fileUrl: string;
  createdAt: string;
}

export interface InferenceRequest {
  sourcePath: string;
  drivingPath: string;
  userId?: number;
}

export interface InferenceStatusResponse {
  success: boolean;
  message: string;
  executedCommand?: string;
  resultVideoPath?: string;
  error?: string;
}
