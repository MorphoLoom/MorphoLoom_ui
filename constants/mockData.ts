/**
 * Mock 데이터 정의
 * 개발 및 테스트 용도로 사용
 * 실제 API 연동 시 제거 또는 주석 처리
 */

export interface SocialPost {
  id: string;
  title: string;
  description: string;
  time: string;
  image: string;
  videoUrl?: string;
  likeCount?: number;
  viewCount?: number;
}

// Unsplash 이미지 URL
const BASE_IMAGES = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
] as const;

// Mock 소셜 포스트 데이터
export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: '1',
    title: '여름 바다',
    description: '휴가에서 찍은 시원한 바다 사진',
    time: '2025-12-01',
    image: BASE_IMAGES[0],
  },
  {
    id: '2',
    title: '겨울 산',
    description: '눈 내린 산 정상에서 한 컷',
    time: '2025-11-28',
    image: BASE_IMAGES[1],
  },
  {
    id: '3',
    title: '도시 야경',
    description: '밤에 본 도심의 불빛',
    time: '2025-11-25',
    image: BASE_IMAGES[2],
  },
  {
    id: '4',
    title: '가을 단풍',
    description: '단풍잎이 아름다운 공원',
    time: '2025-11-20',
    image: BASE_IMAGES[3],
  },
  {
    id: '5',
    title: '봄 꽃',
    description: '벚꽃이 만개한 거리',
    time: '2025-11-15',
    image: BASE_IMAGES[4],
  },
  {
    id: '6',
    title: '강아지 산책',
    description: '강아지와 함께한 산책길',
    time: '2025-11-10',
    image: BASE_IMAGES[5],
  },
  {
    id: '7',
    title: '커피 한 잔',
    description: '카페에서 마신 따뜻한 커피',
    time: '2025-11-05',
    image: BASE_IMAGES[6],
  },
  {
    id: '8',
    title: '책 읽는 시간',
    description: '조용한 오후의 독서',
    time: '2025-11-01',
    image: BASE_IMAGES[7],
  },
  {
    id: '9',
    title: '운동하는 날',
    description: '헬스장에서 운동하는 모습',
    time: '2025-10-28',
    image: BASE_IMAGES[8],
  },
];

// 좋아요한 포스트 (전체의 일부)
export const MOCK_LIKED_POSTS: SocialPost[] = [
  MOCK_SOCIAL_POSTS[0],
  MOCK_SOCIAL_POSTS[2],
  MOCK_SOCIAL_POSTS[4],
  MOCK_SOCIAL_POSTS[7],
];
