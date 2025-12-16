import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../context/ThemeContext';
import {useCreationDetail} from '../../hooks/useCreationDetail';
import {useCreationLike} from '../../hooks/useCreationLike';

interface SocialDetailScreenProps {
  route: {
    params: {
      item: {
        id: string;
      };
    };
  };
  navigation: any;
}

const SocialDetailScreen: React.FC<SocialDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {colors} = useTheme();
  const {item} = route.params;
  const videoRef = useRef<any>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [paused, setPaused] = useState(false);

  // 창작물 상세 조회
  const {data: creation, isLoading, error} = useCreationDetail(item.id);
  const {like, unlike, isLiking, isUnliking} = useCreationLike(item.id);

  // 초기 좋아요 상태 설정
  useEffect(() => {
    if (creation) {
      setLiked(creation.isLiked);
      setLikesCount(creation.likes);
    }
  }, [creation]);

  const handleVideoEnd = () => {
    setShowControls(true);
    setPaused(true);
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const handlePlayPause = (event: any) => {
    event?.stopPropagation();
    const newPausedState = !paused;

    // 비디오가 끝난 상태에서 재생 버튼을 누르면 처음부터 재생
    if (paused && videoRef.current) {
      videoRef.current.seek(0);
    }

    setPaused(newPausedState);

    // 재생 시작하면 컨트롤 숨기기 (일시정지 상태에서 재생으로 전환)
    if (!newPausedState) {
      setTimeout(() => setShowControls(false), 100);
    }
  };

  const handleFullscreen = (event: any) => {
    event?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer();
    }
  };

  const handleLikeToggle = () => {
    if (isLiking || isUnliking) return;

    if (liked) {
      // 좋아요 취소
      setLiked(false);
      setLikesCount(prev => prev - 1);

      unlike(undefined, {
        onSuccess: (data) => {
          // 서버 응답으로 정확한 값 업데이트
          setLikesCount(data.likes);
        },
        onError: () => {
          // 실패 시 롤백
          setLiked(true);
          setLikesCount(prev => prev + 1);
        },
      });
    } else {
      // 좋아요 추가
      setLiked(true);
      setLikesCount(prev => prev + 1);

      like(undefined, {
        onSuccess: (data) => {
          // 서버 응답으로 정확한 값 업데이트
          setLikesCount(data.likes);
        },
        onError: () => {
          // 실패 시 롤백
          setLiked(false);
          setLikesCount(prev => prev - 1);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !creation) {
    return (
      <View style={[styles.container, styles.centerContainer, {backgroundColor: colors.background}]}>
        <Text style={[styles.errorText, {color: colors.error}]}>
          데이터를 불러올 수 없습니다
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, {backgroundColor: colors.primary}]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 상단 헤더 영역 */}
      <View style={[styles.header, {backgroundColor: colors.background}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, {color: colors.text}]}
          numberOfLines={1}>
          {creation.title}
        </Text>
        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 비디오 */}
        <TouchableOpacity
          style={styles.videoContainer}
          activeOpacity={1}
          onPress={handleVideoPress}>
          <Video
            ref={videoRef}
            source={{uri: creation.videoUrl}}
            style={styles.video}
            resizeMode="contain"
            controls={false}
            paused={paused}
            repeat={false}
            onEnd={handleVideoEnd}
          />
          {showControls && (
            <View style={styles.videoControlsOverlay}>
              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  style={styles.playPauseButton}
                  onPress={handlePlayPause}
                  activeOpacity={0.7}>
                  <Ionicons
                    name={paused ? 'play-circle' : 'pause-circle'}
                    size={64}
                    color="#fff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.fullscreenButton}
                  onPress={handleFullscreen}
                  activeOpacity={0.7}>
                  <Ionicons name="expand-outline" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* 정보 영역 */}
        <View style={styles.infoContainer}>
          <View style={styles.metaInfo}>
            <Text style={[styles.username, {color: colors.text}]}>
              {creation.username}
            </Text>
            <TouchableOpacity
              style={styles.likeContainer}
              onPress={handleLikeToggle}
              activeOpacity={0.7}
              disabled={isLiking || isUnliking}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={24}
                color={liked ? '#FF4458' : colors.textSecondary}
              />
              <Text style={[styles.likesCount, {color: colors.textSecondary}]}>
                {likesCount}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.description, {color: colors.text}]}>
            {creation.description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRightSpace: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  videoContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  playPauseButton: {
    padding: 10,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
  },
  infoContainer: {
    padding: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likesCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SocialDetailScreen;
