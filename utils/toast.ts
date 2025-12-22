import Toast from 'react-native-toast-message';
import {Platform, StatusBar} from 'react-native';

export interface ToastOptions {
  duration?: number;
  topOffset?: number;
  onPress?: () => void;
}

// Toast 기본 상단 여백 (Header 아래 적절한 위치)
// iOS: SafeArea(약 47) + Header(약 50) = 약 100
// Android: StatusBar(약 24) + Header(약 50) = 약 74, 하지만 더 여유있게
const DEFAULT_TOP_OFFSET = Platform.select({
  ios: 80,
  android: (StatusBar.currentHeight || 24) + 20,
}) as number;

console.log('DEFAULT_TOP_OFFSET:', DEFAULT_TOP_OFFSET);
export const showToast = {
  success: (text1: string, text2?: string, options?: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1,
      text2,
      visibilityTime: options?.duration || 3000,
      topOffset: options?.topOffset ?? DEFAULT_TOP_OFFSET,
      onPress: options?.onPress,
      text1Style: {
        fontSize: 14,
        fontWeight: '600',
      },
      text2Style: {
        fontSize: 12,
      },
      props: {
        style: {
          height: 60,
          minHeight: 60,
        },
      },
    });
  },

  error: (text1: string, text2?: string, options?: ToastOptions) => {
    Toast.show({
      type: 'error',
      text1,
      text2,
      visibilityTime: options?.duration || 3000,
      topOffset: options?.topOffset ?? DEFAULT_TOP_OFFSET,
      onPress: options?.onPress,
      text1Style: {
        fontSize: 14,
        fontWeight: '600',
      },
      text2Style: {
        fontSize: 12,
      },
      props: {
        style: {
          height: 60,
          minHeight: 60,
        },
      },
    });
  },

  info: (text1: string, text2?: string, options?: ToastOptions) => {
    Toast.show({
      type: 'info',
      text1,
      text2,
      visibilityTime: options?.duration || 3000,
      topOffset: options?.topOffset ?? DEFAULT_TOP_OFFSET,
      onPress: options?.onPress,
      text1Style: {
        fontSize: 14,
        fontWeight: '600',
      },
      text2Style: {
        fontSize: 12,
      },
      props: {
        style: {
          height: 60,
          minHeight: 60,
        },
      },
    });
  },

  warning: (text1: string, text2?: string, options?: ToastOptions) => {
    Toast.show({
      type: 'warning',
      text1,
      text2,
      visibilityTime: options?.duration || 3000,
      topOffset: options?.topOffset ?? DEFAULT_TOP_OFFSET,
      onPress: options?.onPress,
      text1Style: {
        fontSize: 14,
        fontWeight: '600',
      },
      text2Style: {
        fontSize: 12,
      },
      props: {
        style: {
          height: 60,
          minHeight: 60,
        },
      },
    });
  },
};
