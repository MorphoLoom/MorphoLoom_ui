import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface MediaAsset {
  uri: string;
  type: 'video' | 'image';
}

const HomeScreen: React.FC = () => {
  const {colors} = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [videoAsset, setVideoAsset] = useState<MediaAsset | null>(null);
  const [imageAsset, setImageAsset] = useState<MediaAsset | null>(null);

  const translateX = useRef(new Animated.Value(0)).current;
  const nextCardTranslateX = useRef(new Animated.Value(width)).current;

  // 스와이프 제스처 핸들러
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        // 왼쪽 스와이프 (다음 카드로)
        if (gestureState.dx < 0 && currentStep < 1) {
          translateX.setValue(gestureState.dx);
          nextCardTranslateX.setValue(width + gestureState.dx);
        }
        // 오른쪽 스와이프 (이전 카드로)
        else if (gestureState.dx > 0 && currentStep > 0) {
          translateX.setValue(gestureState.dx);
          nextCardTranslateX.setValue(gestureState.dx - width);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // 왼쪽 스와이프 - 다음 카드로
        if (gestureState.dx < -100 && currentStep < 1) {
          swipeToNext();
        }
        // 오른쪽 스와이프 - 이전 카드로
        else if (gestureState.dx > 100 && currentStep > 0) {
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
              toValue: currentStep === 0 ? width : -width,
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
      setCurrentStep(1);
      translateX.setValue(0);
      nextCardTranslateX.setValue(width);
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
      setCurrentStep(0);
      translateX.setValue(0);
      nextCardTranslateX.setValue(width);
    });
  };

  const handleMediaPick = async (type: 'video' | 'image') => {
    const result = await launchImageLibrary({
      mediaType: type === 'video' ? 'video' : 'photo',
      quality: 1,
    });

    if (result.assets && result.assets[0]) {
      const asset: MediaAsset = {
        uri: result.assets[0].uri || '',
        type,
      };

      if (type === 'video') {
        setVideoAsset(asset);
      } else {
        setImageAsset(asset);
      }
    }
  };

  const handleStart = () => {
    if (!videoAsset || !imageAsset) {
      console.log('비디오와 이미지를 모두 선택해주세요');
      // TODO: Alert 또는 Toast 메시지 표시
      return;
    }
    console.log('Starting inference with:', {videoAsset, imageAsset});
    // TODO: 합성 API 호출
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.cardContainer} {...panResponder.panHandlers}>
        {/* 비디오 카드 */}
        <Animated.View
          style={[
            styles.card,
            styles.absoluteCard,
            {
              backgroundColor: colors.card,
              transform: [{translateX: currentStep === 0 ? translateX : nextCardTranslateX}],
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.uploadArea,
              {
                borderColor: colors.border,
                backgroundColor: videoAsset ? 'transparent' : colors.background,
              },
            ]}
            onPress={() => handleMediaPick('video')}>
            {videoAsset ? (
              <View style={styles.previewContainer}>
                <Icon name="video-camera" size={60} color={colors.primary} />
                <Text style={[styles.selectedText, {color: colors.text}]}>
                  Video Selected
                </Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={80} color={colors.border} />
                <Text style={[styles.uploadTitle, {color: colors.text}]}>
                  비디오 선택
                </Text>
                <Text style={[styles.uploadSubtitle, {color: colors.textSecondary}]}>
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
              transform: [{translateX: currentStep === 1 ? translateX : nextCardTranslateX}],
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.uploadArea,
              {
                borderColor: colors.border,
                backgroundColor: imageAsset ? 'transparent' : colors.background,
              },
            ]}
            onPress={() => handleMediaPick('image')}>
            {imageAsset ? (
              <View style={styles.previewContainer}>
                <Icon name="image" size={60} color={colors.primary} />
                <Text style={[styles.selectedText, {color: colors.text}]}>
                  Image Selected
                </Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="plus-circle" size={80} color={colors.border} />
                <Text style={[styles.uploadTitle, {color: colors.text}]}>
                  인물 사진 선택
                </Text>
                <Text style={[styles.uploadSubtitle, {color: colors.textSecondary}]}>
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
              style={[styles.warningText, {color: colors.error, marginTop: 12}]}>
              {!videoAsset && !imageAsset
                ? '비디오와 이미지를 선택해주세요'
                : !videoAsset
                ? '비디오를 선택해주세요'
                : '이미지를 선택해주세요'}
            </Text>
          )}

          <View style={styles.bottomIndicator}>
            <View style={styles.stepIndicator}>
              <View style={[styles.dot, {backgroundColor: colors.primary}]} />
              <View style={[styles.dot, {backgroundColor: colors.primary}]} />
            </View>
          </View>
        </Animated.View>
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
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  absoluteCard: {
    position: 'absolute',
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
    alignItems: 'center',
    gap: 16,
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
});

export default HomeScreen;
