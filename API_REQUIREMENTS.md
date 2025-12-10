# MorphoLoom UI - API 요구사항 명세서

## 📋 목차
- [인증 관련 API](#인증-관련-api)
- [비디오 합성 API](#비디오-합성-api)
- [미디어 관리 API](#미디어-관리-api)
- [랭킹 시스템 API](#랭킹-시스템-api)
- [소셜 관리 API](#소셜-관리-api)
- [사용자 설정 API](#사용자-설정-api)

---

## 🔐 인증 관련 API

### 1. 로그인
- **Endpoint**: `POST /api/auth/login`
- **Description**: 사용자 로그인 처리
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "token": "jwt_token_here",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "사용자 이름",
        "profileImage": "https://..."
      }
    }
  }
  ```
- **현재 구현**: LoginScreen.tsx에서 로그인 폼 UI 구현됨

### 2. 로그아웃
- **Endpoint**: `POST /api/auth/logout`
- **Description**: 사용자 로그아웃 처리
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "로그아웃 되었습니다"
  }
  ```

### 3. 회원가입
- **Endpoint**: `POST /api/auth/register`
- **Description**: 신규 사용자 등록
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "사용자 이름"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "userId": "user_id",
      "message": "회원가입이 완료되었습니다"
    }
  }
  ```

---

## 🎬 비디오 합성 API

### 1. 비디오 합성 요청
- **Endpoint**: `POST /api/synthesis/create`
- **Description**: 비디오와 이미지를 받아 얼굴 합성 처리 요청
- **Headers**: `Authorization: Bearer {token}`
- **Request Body** (multipart/form-data):
  ```
  video: File (비디오 파일)
  image: File (인물 사진 파일)
  userId: string
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "jobId": "synthesis_job_id",
      "status": "processing",
      "estimatedTime": 30,
      "message": "합성 작업이 시작되었습니다"
    }
  }
  ```
- **현재 구현**: HomeScreen.tsx의 handleStart() 함수에서 mock으로 3초 대기 후 결과 표시

### 2. 합성 결과 다운로드
- **Endpoint**: `GET /api/synthesis/result/{jobId}`
- **Description**: 완료된 합성 비디오 다운로드
- **Headers**: `Authorization: Bearer {token}`
- **Response**: Video file (binary)
- **현재 구현**: 결과 카드에서 비디오 미리보기 표시

---

## 💾 미디어 관리 API

### 1. 비디오 저장 (서버에 저장)
- **Endpoint**: `POST /api/media/save`
- **Description**: 합성 완료된 비디오를 **서버의 공개 갤러리**에 저장
  - 서버 데이터베이스에 메타데이터 저장
  - 모든 사용자가 볼 수 있는 공개 갤러리에 게시됨
  - 다른 기기에서 로그인해도 동일하게 접근 가능
  - **주의**: 디바이스(휴대폰) 갤러리 저장이 아님
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "jobId": "synthesis_job_id",
    "videoUrl": "https://...",
    "title": "내 합성 비디오",
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "mediaId": "media_id",
      "savedAt": "2025-12-10T12:00:00Z",
      "message": "비디오가 저장되었습니다"
    }
  }
  ```
- **현재 구현**: 결과 카드의 "저장" 버튼 (onPress 핸들러 필요)
- **저장 위치**:
  - ✅ 서버 DB + 클라우드 스토리지 (공개 갤러리)
  - ❌ 디바이스 갤러리 (별도 구현 필요)

### 2. 전체 비디오 목록 조회 (공개 갤러리)
- **Endpoint**: `GET /api/media/all`
- **Description**: **모든 사용자들이 저장한 비디오** 목록 조회 (공개 갤러리)
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `page`: number (페이지 번호)
  - `limit`: number (페이지당 항목 수)
  - `sortBy`: string (latest | popular | trending)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "videos": [
        {
          "id": "media_id",
          "videoUrl": "https://...",
          "thumbnailUrl": "https://...",
          "title": "합성 비디오",
          "createdAt": "2025-12-10T12:00:00Z",
          "likeCount": 120,
          "viewCount": 500,
          "isLiked": false,
          "user": {
            "id": "user_id",
            "name": "사용자 이름",
            "profileImage": "https://..."
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 10,
        "totalItems": 100
      }
    }
  }
  ```
- **현재 구현**: SocialScreen.tsx의 "전체" 탭

### 3. 내가 저장한 비디오 목록 조회
- **Endpoint**: `GET /api/media/my-videos`
- **Description**: 현재 로그인한 사용자가 저장한 비디오 목록
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `page`: number
  - `limit`: number
- **Response**: (2번과 동일한 형식)

### 3. 비디오 삭제
- **Endpoint**: `DELETE /api/media/{mediaId}`
- **Description**: 저장된 비디오 삭제
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "message": "비디오가 삭제되었습니다"
  }
  ```

---

## 🏆 랭킹 시스템 API

### 1. 전체 랭킹 조회
- **Endpoint**: `GET /api/ranking/list`
- **Description**: 인기 비디오 랭킹 조회
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `period`: string (daily | weekly | monthly | all-time)
  - `page`: number
  - `limit`: number
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "rankings": [
        {
          "rank": 1,
          "videoId": "video_id",
          "videoUrl": "https://...",
          "thumbnailUrl": "https://...",
          "title": "랭킹 1위 비디오",
          "user": {
            "id": "user_id",
            "name": "사용자 이름",
            "profileImage": "https://..."
          },
          "likeCount": 15000,
          "viewCount": 50000,
          "createdAt": "2025-12-01T10:00:00Z"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 10
      }
    }
  }
  ```
- **현재 구현**: RankingScreen.tsx에 UI 준비

---

## 👥 소셜 관리 API

### 1. 공개 갤러리 목록 조회 (전체 탭)
- **Endpoint**: `GET /api/social/all`
- **Description**: **모든 사용자가 저장한 합성 비디오**를 썸네일 그리드 형태로 조회
  - Social 페이지의 "전체" 탭에서 사용
  - 썸네일 클릭 시 상세 페이지로 이동 (제목, 설명, 생성 날짜 표시)
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `page`: number (페이지 번호)
  - `limit`: number (페이지당 항목 수)
  - `sortBy`: string (latest | popular | trending)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "videos": [
        {
          "id": "video_id",
          "videoUrl": "https://...",
          "thumbnailUrl": "https://...",
          "title": "합성 비디오 제목",
          "description": "비디오 설명",
          "createdAt": "2025-12-10T12:00:00Z",
          "likeCount": 120,
          "viewCount": 500,
          "isLiked": false,
          "user": {
            "id": "user_id",
            "name": "제작자 이름",
            "profileImage": "https://..."
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 10,
        "totalItems": 100
      }
    }
  }
  ```
- **현재 구현**: SocialScreen.tsx의 "전체" 탭 (썸네일 그리드)

### 2. 좋아요한 비디오 목록 조회 (좋아요 탭)
- **Endpoint**: `GET /api/social/my-likes`
- **Description**: **내가 좋아요한 합성 비디오만** 썸네일 그리드 형태로 조회
  - Social 페이지의 "좋아요" 탭에서 사용
  - 썸네일 클릭 시 상세 페이지로 이동
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**:
  - `page`: number
  - `limit`: number
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "likedVideos": [
        {
          "id": "video_id",
          "videoUrl": "https://...",
          "thumbnailUrl": "https://...",
          "title": "좋아요한 비디오 제목",
          "description": "비디오 설명",
          "likeCount": 5000,
          "viewCount": 15000,
          "likedAt": "2025-12-10T12:00:00Z",
          "createdAt": "2025-12-01T10:00:00Z",
          "isLiked": true,
          "user": {
            "id": "user_id",
            "name": "제작자 이름",
            "profileImage": "https://..."
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 50
      }
    }
  }
  ```
- **현재 구현**: SocialScreen.tsx의 "좋아요" 탭 (썸네일 그리드)

### 3. 비디오 상세 정보 조회
- **Endpoint**: `GET /api/social/detail/{videoId}`
- **Description**: 합성 비디오의 상세 정보 조회 (제목, 설명, 생성 날짜 등)
  - 썸네일 클릭 시 표시되는 상세 페이지
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "video_id",
      "videoUrl": "https://...",
      "thumbnailUrl": "https://...",
      "title": "비디오 제목",
      "description": "비디오 설명",
      "likeCount": 5000,
      "viewCount": 15000,
      "createdAt": "2025-12-01T10:00:00Z",
      "isLiked": false,
      "user": {
        "id": "user_id",
        "name": "제작자 이름",
        "profileImage": "https://..."
      },
      "tags": ["태그1", "태그2"]
    }
  }
  ```
- **현재 구현**: SocialDetailScreen.tsx에 상세 화면 구현됨

### 4. 좋아요 추가
- **Endpoint**: `POST /api/social/like`
- **Description**: 비디오에 좋아요 추가
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "videoId": "video_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "likeCount": 121,
      "message": "좋아요가 추가되었습니다"
    }
  }
  ```

### 5. 좋아요 취소
- **Endpoint**: `DELETE /api/social/unlike/{videoId}`
- **Description**: 비디오 좋아요 취소
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "likeCount": 120,
      "message": "좋아요가 취소되었습니다"
    }
  }
  ```

---

## ⚙️ 사용자 설정 API

### 1. 사용자 프로필 조회
- **Endpoint**: `GET /api/user/profile`
- **Description**: 현재 로그인한 사용자의 프로필 정보 조회
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "사용자 이름",
      "profileImage": "https://...",
      "bio": "자기소개",
      "createdAt": "2025-01-01T00:00:00Z",
      "settings": {
        "isDarkMode": true,
        "notifications": {
          "synthesis": true,
          "likes": true,
          "comments": false
        }
      }
    }
  }
  ```
- **현재 구현**: SettingScreen.tsx에 UI 준비

### 2. 프로필 업데이트
- **Endpoint**: `PUT /api/user/profile`
- **Description**: 사용자 프로필 정보 업데이트
- **Headers**: `Authorization: Bearer {token}`
- **Request Body** (multipart/form-data):
  ```
  name: string
  bio: string
  profileImage: File (optional)
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "message": "프로필이 업데이트되었습니다",
      "profileImage": "https://..."
    }
  }
  ```

### 3. 설정 업데이트
- **Endpoint**: `PUT /api/user/settings`
- **Description**: 사용자 앱 설정 업데이트
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
  ```json
  {
    "isDarkMode": true,
    "notifications": {
      "synthesis": true,
      "likes": true,
      "comments": false
    },
    "language": "ko"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "설정이 업데이트되었습니다"
  }
  ```
- **현재 구현**: ThemeContext에서 다크모드 관리 중

