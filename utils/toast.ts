import Toast from 'react-native-toast-message';

export interface ToastOptions {
  duration?: number;
  topOffset?: number;
  onPress?: () => void;
}

export const showToast = {
  success: (text1: string, text2?: string, options?: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1,
      text2,
      visibilityTime: options?.duration || 3000,
      topOffset: options?.topOffset || 30,
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
      topOffset: options?.topOffset || 30,
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
      topOffset: options?.topOffset || 30,
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
      topOffset: options?.topOffset || 30,
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
