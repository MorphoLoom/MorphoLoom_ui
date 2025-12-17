import React, {createContext, useState, useContext, useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '@env';
import type {AuthUser} from '../types/api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuthData: (
    accessToken: string,
    refreshToken: string,
    user: AuthUser,
  ) => Promise<void>;
  clearAuth: () => Promise<void>;
  refreshTokenIfNeeded: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // JWT 토큰 디코딩하여 만료 시간 확인
  const getTokenExpiry = (token: string): number | null => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.exp ? decoded.exp * 1000 : null; // 밀리초로 변환
    } catch (error) {
      console.error('토큰 디코딩 실패:', error);
      return null;
    }
  };

  // 토큰 갱신 함수
  const refreshTokenIfNeeded = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!token || !refreshToken) {
        return;
      }

      const expiry = getTokenExpiry(token);
      if (!expiry) {
        return;
      }

      const now = Date.now();
      const timeUntilExpiry = expiry - now;

      // 만료 2분 전이거나 이미 만료되었으면 갱신 (토큰이 5분 만료인 경우 3분 시점에 갱신)
      if (timeUntilExpiry < 2 * 60 * 1000) {
        console.log('🔄 [AuthContext] 토큰 만료 임박 또는 만료됨 - 자동 갱신 시작');
        console.log(`⏱️ [AuthContext] 남은 시간: ${Math.floor(timeUntilExpiry / 1000)}초`);

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {refreshToken},
          {
            headers: {'Content-Type': 'application/json'},
          },
        );

        const {accessToken: newAccessToken, refreshToken: newRefreshToken} = response.data;

        await AsyncStorage.setItem('accessToken', newAccessToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        setAccessToken(newAccessToken);
        // console.log('✅ [AuthContext] 토큰 자동 갱신 완료');
      } else {
        // console.log(`✅ [AuthContext] 토큰 유효 - 남은 시간: ${Math.floor(timeUntilExpiry / 1000)}초`);
      }
    } catch (error) {
      console.error('❌ [AuthContext] 토큰 자동 갱신 실패:', error);
      // 갱신 실패 시 로그아웃
      await clearAuth();
    }
  };

  // 앱 시작 시 저장된 토큰 확인
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          setAccessToken(token);
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);

          // 초기 로딩 시에도 토큰 갱신 체크
          await refreshTokenIfNeeded();
        } else {
          setAccessToken(null);
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // AppState 변화 감지 (앱 재진입, 화면 켜짐, 백그라운드 복귀)
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      console.log(`📱 [AuthContext] AppState 변경: ${nextAppState}`);

      // 앱이 active 상태로 전환될 때 (백그라운드에서 복귀, 화면 켜짐)
      if (nextAppState === 'active') {
        console.log('🔄 [AuthContext] 앱 활성화 감지 - 토큰 갱신 체크');
        await refreshTokenIfNeeded();
      }
    });

    return () => {
      subscription.remove();
    };
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
      value={{isLoggedIn, user, accessToken, isLoading, setAuthData, clearAuth, refreshTokenIfNeeded}}>
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
