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
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  userId: string;
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
