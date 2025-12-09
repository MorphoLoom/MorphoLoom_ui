// 전역 색상 팔레트 - 여기서 한 번에 관리
export const COLORS = {
  // Primary 색상 (보라색 계열)
  primary: '#6E4877',
  primaryLight: '#9B7BA3',
  primaryDark: '#503554',

  // Secondary 색상 (연한 보라색)
  secondary: '#B8A5C0',
  secondaryLight: '#D4CAD9',

  // Accent 색상
  accent: '#E8DEF8',

  // 상태 색상
  success: '#7CB342',
  warning: '#FFB74D',
  error: '#E57373',
  info: '#64B5F6',

  // 중립 색상
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E0E0E0',
    300: '#BDBDBD',
    400: '#9E9E9E',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#303030',
    900: '#212121',
  },
} as const;
