# MorphoLoom

AI 기반 얼굴 합성 모바일 애플리케이션

## 서비스 소개

MorphoLoom은 사용자가 업로드한 비디오와 이미지를 기반으로 AI 딥페이크 합성을 수행하는 모바일 앱입니다.

### 주요 기능

- **미디어 업로드**: 비디오와 인물 사진 업로드
- **AI 합성**: 서버 기반 AI 추론을 통한 얼굴 합성
- **창작물 관리**: 합성된 결과물 저장 및 공유
- **소셜 피드**: 다른 사용자의 창작물 탐색 및 좋아요

## 기술 스택

### Frontend
- **React Native** 0.75.3
- **TypeScript** 5.0.4
- **React Navigation** 6.x (네비게이션)
- **TanStack Query** 5.x (서버 상태 관리)
- **Axios** (HTTP 클라이언트)

### UI/UX
- **React Native Reanimated** (애니메이션)
- **React Native Gesture Handler** (제스처)
- **React Native Vector Icons** (아이콘)
- **React Native Toast Message** (토스트 알림)

### 미디어
- **React Native Image Picker** (이미지/비디오 선택)
- **React Native Video** (비디오 재생)
- **React Native Camera Roll** (갤러리 접근)
- **React Native FS** (파일 시스템)

### 인증 & 저장소
- **Async Storage** (로컬 저장소)
- **JWT 기반 인증**

## 환경 설정

### 요구 사항
- Node.js >= 18
- React Native CLI
- Android Studio (Android 빌드)
- Xcode (iOS 빌드)

### 환경 변수

프로젝트 루트에 환경별 `.env` 파일 생성:

```bash
# .env.development
API_BASE_URL=http://localhost:8080/api/v1

# .env.staging
API_BASE_URL=https://staging-api.example.com/api/v1

# .env.production
API_BASE_URL=https://api.example.com/api/v1
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# iOS 의존성 설치 (macOS)
cd ios && pod install && cd ..

# Metro 서버 시작
npm start

# Android 실행
npm run android:dev      # 개발
npm run android:staging  # 스테이징
npm run android:prod     # 프로덕션

# iOS 실행
npm run ios:dev          # 개발
npm run ios:staging      # 스테이징
npm run ios:prod         # 프로덕션
```

## 프로젝트 구조

```
├── assets/              # 이미지, 폰트 등 정적 리소스
├── components/          # 공통 UI 컴포넌트
├── context/             # React Context (Theme, Auth)
├── hooks/               # 커스텀 훅
├── navigation/          # 네비게이션 설정
├── screens/             # 화면 컴포넌트
├── services/api/        # API 클라이언트
├── types/               # TypeScript 타입 정의
└── utils/               # 유틸리티 함수
```

## 라이선스

Private
