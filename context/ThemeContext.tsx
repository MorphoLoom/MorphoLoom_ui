import React, {createContext, useState, useContext} from 'react';
import {useColorScheme} from 'react-native';
import {COLORS} from '../constants/colors';

interface ThemeColors {
  // 기본 색상
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  card: string;
  border: string;
  // 브랜드 색상
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  // 상태 색상
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors: ThemeColors = {
    // 기본 색상
    background: isDarkMode ? '#000000' : '#FFFFFF',
    surface: isDarkMode ? '#1C1C1E' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#A0A0A0' : '#666666',
    card: isDarkMode ? '#1C1C1E' : '#F2F2F7',
    border: isDarkMode ? '#38383A' : '#E0E0E0',
    // 브랜드 색상 (라이트/다크 모드 동일)
    primary: COLORS.primary,
    primaryLight: COLORS.primaryLight,
    primaryDark: COLORS.primaryDark,
    secondary: COLORS.secondary,
    secondaryLight: COLORS.secondaryLight,
    accent: COLORS.accent,
    // 상태 색상 (라이트/다크 모드 동일)
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    info: COLORS.info,
  };

  return (
    <ThemeContext.Provider value={{isDarkMode, toggleTheme, colors}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
