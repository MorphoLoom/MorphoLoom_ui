// 전역 색상 팔레트 - 여기서 한 번에 관리
export const COLORS = {
  // Primary 색상 (로고의 밝은 보라색 - 왼쪽 영역)
  primary: '#7C4DFF',
  primaryLight: '#B085FF',
  primaryDark: '#5E35B1',

  // Secondary 색상 (로고의 파랑색 - 오른쪽 영역)
  secondary: '#4A9DD8',
  secondaryLight: '#7BB5E3',

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
