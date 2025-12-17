import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import Video from 'react-native-video';
import Toast from 'react-native-toast-message';
import {showToast} from '../../utils/toast';
import {deleteTempVideo} from '../../services/api/contentApi';
import {useMediaUpload} from '../../hooks/useMediaUpload';
import {useInference} from '../../hooks/useInference';
import {useCreateCreation} from '../../hooks/useSocialPosts';

const {width, height} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const HomeScreen: React.FC = () => {
  const {colors} = useTheme();
  const {refreshTokenIfNeeded} = useAuth();
  const [currentStep, setCurrentStep] = useState(0); // 0: 비디오, 1: 이미지

  // useMediaUpload hook 사용
  const {
    videoAsset,
    imageAsset,
    isUploadingVideo,
    isUploadingImage,
    uploadedVideoUrl,
    uploadedImageUrl,
    handleMediaPick,
    handleDelete,
    resetMedia,
  } = useMediaUpload();

  // useInference hook 사용
  const {
    isProcessing,
    resultVideo,
    handleStart: executeInference,
    resetResult,
  } = useInference();

  // 창작물 등록 hook
  const {mutate: createCreation, isPending: isRegistering} = useCreateCreation();

  // 결과 카드와 폼 카드 표시 상태 (step과 독립적)
  const [showResultCard, setShowResultCard] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // 등록 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filename, setFilename] = useState('');

  const translateX = useRef(new Animated.Value(0)).current;
  const nextCardTranslateX = useRef(new Animated.Value(width)).current;
  const currentStepRef = useRef(0);
  const videoPlayer = useRef<any>(null);

  // 결과/폼 카드 애니메이션
  const resultCardTranslateY = useRef(new Animated.Value(height)).current;
  const registerCardTranslateY = useRef(new Animated.Value(height)).current;

  // 글로우 + 펄스 애니메이션
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  // 탭에 포커스될 때 비디오 카드로 리셋 + 토큰 갱신 체크
  useFocusEffect(
    useCallback(() => {
      // 토큰 갱신 체크
      refreshTokenIfNeeded();

      // 모든 상태 초기화
      translateX.setValue(0);
      nextCardTranslateX.setValue(width);
      currentStepRef.current = 0;
      setCurrentStep(0);
      setShowResultCard(false);
      setShowRegisterForm(false);
      resultCardTranslateY.setValue(height);
      registerCardTranslateY.setValue(height);
    }, [translateX, nextCardTranslateX, resultCardTranslateY, registerCardTranslateY, refreshTokenIfNeeded]),
  );

  // 컴포넌트 언마운트 시 임시 파일 삭제
  useEffect(() => {
    return () => {
      // unmount 시 임시 파일 삭제 (페이지 벗어날 때)
      if (resultVideo) {
        deleteTempVideo(resultVideo);
      }
    };
  }, [resultVideo]);

  // 스와이프 제스처 핸들러 (기본 0,1 카드만)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (_, gestureState) => {
        const step = currentStepRef.current;
        // 왼쪽 스와이프 (다음 카드로)
        if (gestureState.dx < 0 && step < 1) {
          translateX.setValue(gestureState.dx);
          nextCardTranslateX.setValue(width + gestureState.dx);
        }
        // 오른쪽 스와이프 (이전 카드로)
        else if (gestureState.dx > 0 && step > 0) {
          translateX.setValue(gestureState.dx);
          nextCardTranslateX.setValue(-width + gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const step = currentStepRef.current;
        // 왼쪽 스와이프 - 다음 카드로
        if (gestureState.dx < -100 && step === 0) {
          swipeToNext();
        }
        // 오른쪽 스와이프 - 이전 카드로
        else if (gestureState.dx > 100 && step === 1) {
          swipeToPrev();
        }
        // 원위치
        else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(nextCardTranslateX, {
              toValue: step === 0 ? width : -width,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const swipeToNext = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      currentStepRef.current = 1;
      setCurrentStep(1);
      translateX.setValue(0);
      nextCardTranslateX.setValue(-width);
    });
  };

  const swipeToPrev = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(nextCardTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      currentStepRef.current = 0;
      setCurrentStep(0);
      translateX.setValue(0);
      nextCardTranslateX.setValue(width);
    });
  };

  // URL에서 파일명 추출 함수
  const extractFilename = (url: string): string => {
    try {
      const parts = url.split('/');
      const extractedFilename = parts[parts.length - 1];
      return decodeURIComponent(extractedFilename);
    } catch (error) {
      console.error('Failed to extract filename:', error);
      return 'video.mp4';
    }
  };

  // 결과 카드 표시 (합성 완료 시)
  const showResult = () => {
    setShowResultCard(true);
    Animated.timing(resultCardTranslateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // 결과 카드 닫기 ("다시 하기" 클릭 시)
  const closeResult = async () => {
    // 임시 파일 삭제
    if (resultVideo) {
      await deleteTempVideo(resultVideo);
    }

    Animated.timing(resultCardTranslateY, {
      toValue: height,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowResultCard(false);
      // 모든 상태 초기화
      currentStepRef.current = 0;
      setCurrentStep(0);
      translateX.setValue(0);
      nextCardTranslateX.setValue(width);
      resetResult();
      resetMedia();
      setTitle('');
      setDescription('');
      setFilename('');
    });
  };

  // 등록 폼 표시
  const showRegisterFormCard = () => {
    if (!resultVideo) {return;}

    // 파일명 추출
    const extractedFilename = extractFilename(resultVideo);
    setFilename(extractedFilename);

    setShowRegisterForm(true);
    Animated.timing(registerCardTranslateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // 등록 폼 닫기
  const closeRegisterForm = () => {
    Animated.timing(registerCardTranslateY, {
      toValue: height,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowRegisterForm(false);
      setTitle('');
      setDescription('');
    });
  };

  // 등록 처리
  const handleRegister = async () => {
    if (!title.trim() || !filename) {return;}

    createCreation(
      {
        title: title.trim(),
        description: description.trim(),
        filename: filename,
      },
      {
        onSuccess: async () => {
          showToast.success('등록 완료', '창작물이 성공적으로 등록되었습니다');

          // 임시 파일 삭제
          if (resultVideo) {
            await deleteTempVideo(resultVideo);
          }

          // 폼 카드 닫기
          registerCardTranslateY.setValue(height);
          setShowRegisterForm(false);

          // 결과 카드 닫기
          resultCardTranslateY.setValue(height);
          setShowResultCard(false);

          // 완전 초기화
          currentStepRef.current = 0;
          setCurrentStep(0);
          translateX.setValue(0);
          nextCardTranslateX.setValue(width);
          resetResult();
          resetMedia();
          setTitle('');
          setDescription('');
          setFilename('');
        },
        onError: (error) => {
          console.error('Registration error:', error);
          showToast.error('등록 실패', '창작물 등록에 실패했습니다');
        },
      },
    );
  };

  const handleStart = async () => {
    if (!videoAsset || !imageAsset) {
      console.log('비디오와 이미지를 모두 선택해주세요');
      return;
    }

    // useInference hook의 handleStart 호출
    await executeInference(uploadedVideoUrl, uploadedImageUrl, () => {
      // 성공 시 콜백: 결과 카드 표시 및 애니메이션
      showResult();

      // 글로우 + 펄스 애니메이션 시작
      Animated.sequence([
        // 1. 글로우 페이드인
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // 2. 펄스 효과 (1번 반복)
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseScale, {
              toValue: 1.05,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(pulseScale, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          {iterations: 1},
        ),
      ]).start(() => {
        // 애니메이션 종료 후 글로우 페이드아웃
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Toast />

      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingPopup}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, {color: colors.text}]}>
              작업중
            </Text>
          </View>
        </View>
      )}

      <View style={styles.cardContainer} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.card,
            styles.absoluteCard,
            {
              backgroundColor: colors.card,
              transform: [
                {
                  translateX:
                    currentStep === 0 ? translateX : nextCardTranslateX,
                },
              ],
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.uploadArea,
              {
                borderColor: videoAsset ? 'transparent' : colors.border,
                borderWidth: videoAsset ? 0 : 2,
                backgroundColor: videoAsset ? 'transparent' : colors.background,
              },
            ]}
            onPress={() => handleMediaPick('video')}
            disabled={isUploadingVideo}>
            {isUploadingVideo ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.uploadTitle, {color: colors.text}]}>
                  업로드 중...
                </Text>
              </View>
            ) : videoAsset ? (
              <>
                <View style={styles.previewContainer}>
                  <Video
                    source={{uri: videoAsset.uri}}
                    ref={videoPlayer}
                    paused={false}
                    repeat={true}
                    muted={true}
                    style={styles.videoThumbnail}
                    resizeMode="contain"
                  />
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete('video')}>
                  <Icon name="trash" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={80} color={colors.border} />
                <Text style={[styles.uploadTitle, {color: colors.text}]}>
                  비디오 선택
                </Text>
                <Text
                  style={[
                    styles.uploadSubtitle,
                    {color: colors.textSecondary},
                  ]}>
                  인물이 포함된 비디오를 선택하세요
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.bottomIndicator}>
            <View style={styles.stepIndicator}>
              <View style={[styles.dot, {backgroundColor: colors.primary}]} />
              <View style={[styles.dot, {backgroundColor: colors.border}]} />
            </View>
            <Text style={[styles.swipeHint, {color: colors.textSecondary}]}>
              왼쪽으로 스와이프하여 계속
            </Text>
          </View>
        </Animated.View>

        {/* 이미지 카드 */}
        <Animated.View
          style={[
            styles.card,
            styles.absoluteCard,
            {
              backgroundColor: colors.card,
              transform: [
                {
                  translateX:
                    currentStep === 1 ? translateX : nextCardTranslateX,
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.uploadArea,
              {
                borderColor: imageAsset ? 'transparent' : colors.border,
                borderWidth: imageAsset ? 0 : 2,
                backgroundColor: imageAsset ? 'transparent' : colors.background,
              },
            ]}
            onPress={() => handleMediaPick('image')}
            disabled={isUploadingImage}>
            {isUploadingImage ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.uploadTitle, {color: colors.text}]}>
                  업로드 중...
                </Text>
              </View>
            ) : imageAsset ? (
              <>
                <View style={styles.previewContainer}>
                  <Image
                    source={{uri: imageAsset.uri}}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete('image')}>
                  <Icon name="trash" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={80} color={colors.border} />
                <Text style={[styles.uploadTitle, {color: colors.text}]}>
                  인물 사진 선택
                </Text>
                <Text
                  style={[
                    styles.uploadSubtitle,
                    {color: colors.textSecondary},
                  ]}>
                  합성할 인물 사진을 선택하세요
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.startButton,
              {
                backgroundColor:
                  videoAsset && imageAsset ? colors.primary : colors.border,
              },
            ]}
            onPress={handleStart}
            disabled={!videoAsset || !imageAsset}>
            <Icon
              name="play"
              size={16}
              color="#FFFFFF"
              style={styles.playIcon}
            />
            <Text style={styles.startButtonText}>합성 시작</Text>
          </TouchableOpacity>

          {(!videoAsset || !imageAsset) && (
            <Text
              style={[
                styles.warningText,
                {color: colors.error, marginTop: 12},
              ]}>
              {!videoAsset && !imageAsset
                ? '비디오와 이미지를 선택해주세요'
                : !videoAsset
                ? '비디오를 선택해주세요'
                : '이미지를 선택해주세요'}
            </Text>
          )}

          <View style={styles.bottomIndicator}>
            <View style={styles.stepIndicator}>
              <View style={[styles.dot, {backgroundColor: colors.border}]} />
              <View style={[styles.dot, {backgroundColor: colors.primary}]} />
            </View>
          </View>
        </Animated.View>

        {/* 결과 카드 (step과 독립적으로 표시) */}
        {showResultCard && resultVideo && (
          <>
            {/* 글로우 효과 레이어 */}
            <Animated.View
              style={[
                styles.glowLayer,
                {
                  shadowColor: colors.primary,
                  opacity: glowOpacity,
                  zIndex: 100,
                  transform: [{translateY: resultCardTranslateY}, {scale: pulseScale}],
                },
              ]}
            />

            {/* 결과 카드 */}
            <Animated.View
              style={[
                styles.card,
                styles.absoluteCard,
                {
                  backgroundColor: colors.card,
                  zIndex: 101,
                  transform: [{translateY: resultCardTranslateY}, {scale: pulseScale}],
                },
              ]}>
              <View style={styles.resultVideoArea}>
                <View style={styles.previewContainer}>
                  <Video
                    source={{uri: resultVideo}}
                    paused={false}
                    repeat={true}
                    muted={true}
                    style={styles.videoThumbnail}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.saveButton, {backgroundColor: colors.primary}]}
                  onPress={showRegisterFormCard}>
                  <Icon name="save" size={20} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>등록</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.retryButton,
                    {backgroundColor: '#FFFFFF', borderColor: colors.border},
                  ]}
                  onPress={closeResult}>
                  <Icon name="refresh" size={20} color={colors.text} />
                  <Text style={[styles.retryButtonText, {color: colors.text}]}>
                    다시 하기
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        )}

        {/* 등록 폼 카드 (step과 독립적으로 표시) */}
        {showRegisterForm && (
          <Animated.View
            style={[
              styles.card,
              styles.absoluteCard,
              {
                backgroundColor: colors.card,
                zIndex: 102,
                transform: [{translateY: registerCardTranslateY}],
              },
            ]}>
            <View style={styles.registerForm}>
              {/* 제목 입력 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, {color: colors.text}]}>
                  제목 <Text style={{color: colors.error}}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="창작물의 제목을 입력하세요"
                  placeholderTextColor={colors.textSecondary}
                  value={title}
                  onChangeText={setTitle}
                  editable={!isRegistering}
                  maxLength={50}
                />
              </View>

              {/* 설명 입력 */}
              <View style={styles.inputGroupFlex}>
                <Text style={[styles.label, {color: colors.text}]}>설명</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textAreaFlex,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="창작물에 대한 설명을 입력하세요 (선택사항)"
                  placeholderTextColor={colors.textSecondary}
                  value={description}
                  onChangeText={setDescription}
                  editable={!isRegistering}
                  multiline
                  maxLength={200}
                  textAlignVertical="top"
                />
              </View>

              {/* 버튼 */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.retryButton,
                    {backgroundColor: colors.background, borderColor: colors.border},
                  ]}
                  onPress={closeRegisterForm}
                  disabled={isRegistering}>
                  <Icon name="close" size={20} color={colors.text} />
                  <Text style={[styles.retryButtonText, {color: colors.text}]}>
                    취소
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor: title.trim()
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                  onPress={handleRegister}
                  disabled={!title.trim() || isRegistering}>
                  {isRegistering ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Icon name="check" size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>등록</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: height * 0.6,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#6E4877',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  absoluteCard: {
    position: 'absolute',
  },
  glowLayer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: height * 0.6,
    borderRadius: 24,
    backgroundColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 60,
    elevation: 30,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  uploadArea: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 12,
    left: '50%',
    marginLeft: -22,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  videoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '600',
  },
  startButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  playIcon: {
    marginRight: 4,
  },
  bottomIndicator: {
    alignItems: 'center',
    marginTop: 16,
  },
  swipeHint: {
    fontSize: 12,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  // 로딩 오버레이
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 200,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultVideoArea: {
    flex: 1,
    width: '100%',
    marginBottom: 24,
  },
  closeButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  saveButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // 등록 폼 스타일
  registerForm: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupFlex: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  textAreaFlex: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 12,
  },
});

export default HomeScreen;
