import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {AuthUser} from '../types/api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  setAuthData: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => Promise<void>;
  clearAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 앱 시작 시 저장된 토큰 확인 및 주기적 검증
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } else {
          // 토큰이 없으면 로그아웃 상태
          setAccessToken(null);
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      }
    };

    loadAuthData();

    // 주기적으로 토큰 존재 여부 확인 (apiClient에서 삭제했을 경우 감지)
    const interval = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token && isLoggedIn) {
          // 토큰이 삭제되었으면 로그아웃 처리
          setAccessToken(null);
          setUser(null);
          setIsLoggedIn(false);
          console.log('토큰 삭제 감지 - 로그아웃 처리');
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
      }
    }, 1000); // 1초마다 확인

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // 인증 데이터 저장
  const setAuthData = async (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setAccessToken(accessToken);
      setUser(user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw error;
    }
  };

  // 인증 데이터 삭제
  const clearAuth = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);

      setAccessToken(null);
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{isLoggedIn, user, accessToken, setAuthData, clearAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
