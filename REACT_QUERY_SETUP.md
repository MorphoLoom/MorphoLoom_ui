# React Query 구조 완성 ✅

API 명세서를 기반으로 React Query 구조를 완성했습니다.

## 📁 생성된 파일 구조

```
project/
├── types/
│   └── api.ts                      # API 타입 정의
├── services/
│   └── api/
│       ├── index.ts                # 공통 fetch 함수
│       ├── socialApi.ts            # 소셜 관련 API
│       ├── authApi.ts              # 인증 관련 API
│       ├── rankingApi.ts           # 랭킹 관련 API
│       └── userApi.ts              # 사용자 관련 API
├── hooks/
│   ├── useSocialPosts.ts           # 소셜 React Query hooks
│   ├── useAuth.ts                  # 인증 React Query hooks
│   ├── useRanking.ts               # 랭킹 React Query hooks
│   └── useUser.ts                  # 사용자 React Query hooks
├── context/
│   └── QueryProvider.tsx           # React Query Provider 설정
└── App.tsx                         # QueryProvider 적용
```

## 🎯 주요 기능

### 1. **소셜 피드 (무한 스크롤)**
- `useAllPosts()` - 전체 게시물 무한 스크롤
- `useLikedPosts()` - 좋아요한 게시물 무한 스크롤
- `useLikePost()` - 좋아요 추가 mutation
- `useUnlikePost()` - 좋아요 취소 mutation

### 2. **랭킹 시스템**
- `useRankings(period)` - 기간별 랭킹 무한 스크롤

### 3. **인증**
- `useLogin()` - 로그인 mutation
- `useLogout()` - 로그아웃 mutation
- `useRegister()` - 회원가입 mutation

### 4. **사용자 프로필**
- `useUserProfile()` - 프로필 조회
- `useUpdateProfile()` - 프로필 업데이트 mutation
- `useUpdateSettings()` - 설정 업데이트 mutation

## 🚀 사용 예시

### SocialScreen에서 사용:
```tsx
import { useAllPosts, useLikedPosts } from '../../hooks/useSocialPosts';

const AllGridTab = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useAllPosts();

  // data.pages 배열을 flat하게 변환
  const videos = data?.pages.flatMap(page => page.data.videos) ?? [];

  return (
    <FlatList
      data={videos}
      onEndReached={() => hasNextPage && fetchNextPage()}
      ListFooterComponent={isFetchingNextPage ? <Spinner /> : null}
    />
  );
};
```

## ⚙️ 주요 설정

### QueryClient 기본 설정:
- **retry**: 실패 시 2번 재시도
- **staleTime**: 5분 (fresh 상태 유지)
- **gcTime**: 10분 (캐시 유지)
- **refetchOnReconnect**: 네트워크 재연결 시 자동 갱신

### 무한 스크롤 종료 조건:
```tsx
getNextPageParam: (lastPage) => {
  const { currentPage, totalPages } = lastPage.data.pagination;
  if (currentPage < totalPages && lastPage.data.videos.length > 0) {
    return currentPage + 1;
  }
  return undefined; // 더 이상 페이지 없음
}
```

## 📝 TODO

1. **토큰 관리**: AsyncStorage에 JWT 토큰 저장/로드
2. **환경변수**: API_BASE_URL을 .env 파일로 관리
3. **에러 처리**: 전역 에러 핸들링 추가
4. **로딩 UI**: 공통 로딩/에러 컴포넌트 생성

## 🔧 다음 단계

실제 컴포넌트에 적용하려면:
1. SocialScreen에서 `useAllPosts()`, `useLikedPosts()` 사용
2. RankingScreen에서 `useRankings()` 사용
3. LoginScreen에서 `useLogin()` 사용
4. SettingScreen에서 `useUserProfile()` 사용
