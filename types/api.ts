// API 공통 타입 정의

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// 사용자 관련 타입
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
}

// 비디오 관련 타입
export interface Video {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
}

// 소셜 피드 응답
export interface SocialFeedResponse {
  videos: Video[];
  pagination: PaginationMeta;
}

// 좋아요한 비디오 응답
export interface LikedVideo extends Video {
  likedAt: string;
}

export interface LikedVideosResponse {
  likedVideos: LikedVideo[];
  pagination: PaginationMeta;
}

// 랭킹 관련 타입
export interface RankingItem {
  rank: number;
  videoId: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  likeCount: number;
  viewCount: number;
  createdAt: string;
}

export interface RankingResponse {
  rankings: RankingItem[];
  pagination: PaginationMeta;
}

// 인증 관련 타입
export interface SendVerificationRequest {
  email: string;
}

export interface SendVerificationResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
}

export interface AuthUser {
  userId: number;
  email: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
  isNewUser: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  socialProvider?: string;
}

export interface RegisterResponse extends AuthResponse {}

export interface SocialLoginRequest {
  provider: string;
  token: string;
}

export interface SocialLoginResponse extends AuthResponse {}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// 사용자 프로필 설정
export interface UserSettings {
  isDarkMode: boolean;
  notifications: {
    synthesis: boolean;
    likes: boolean;
    comments: boolean;
  };
  language?: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  settings: UserSettings;
}

// 좋아요 관련
export interface LikeRequest {
  videoId: string;
}

export interface LikeResponse {
  likeCount: number;
  message: string;
}

// 창작물(Creation) 관련 타입
export interface Creation {
  id: string;
  userId: string;
  title: string;
  description: string;
  filename: string;
  thumbnail: string;
  likes: number;
  rankScore: number;
  createdAt: string;
}

export interface CreationListResponse {
  page: number;
  size: number;
  items: Creation[];
}

export interface CreateCreationRequest {
  title: string;
  description: string;
  filename: string;
}

export interface CreationLikeResponse {
  liked: boolean;
  likes: number;
}

// 창작물 상세 조회 응답
export interface CreationDetailResponse {
  creationId: number;
  title: string;
  likes: number;
  createdAt: string;
  description: string;
  username: string;
  filename: string;
  videoUrl: string;
  isLiked: boolean;
}

// 컨텐츠 업로드 관련 타입
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

// AI 추론 관련 타입
export interface InferenceRequest {
  sourcePath: string;
  drivingPath: string;
}

export interface InferenceStatusResponse {
  success: boolean;
  message: string;
  executedCommand?: string;
  resultVideoPath?: string;
  thumbnailUrl?: string;
  error?: string;
}
