import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import {useLogout} from '../../hooks/useAuth';
import {showToast} from '../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingScreen: React.FC = () => {
  const {colors} = useTheme();
  const {clearAuth, user} = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      // AsyncStorage에서 refreshToken 가져오기
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!refreshToken) {
        showToast.error('로그아웃 실패', '인증 정보를 찾을 수 없습니다');
        return;
      }

      // API 로그아웃 호출
      await logoutMutation.mutateAsync(refreshToken);

      // 로컬 데이터 삭제
      await clearAuth();

      showToast.success('로그아웃 완료', '다시 로그인해주세요');
    } catch (error) {
      showToast.error('로그아웃 실패', '다시 시도해주세요');
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>설정</Text>

        {/* 사용자 정보 표시 */}
        {user && (
          <View style={[styles.userInfo, {backgroundColor: colors.card}]}>
            <Text style={[styles.label, {color: colors.textSecondary}]}>
              로그인 계정:
            </Text>
            <Text style={[styles.email, {color: colors.text}]}>
              {user.email}
            </Text>
            <Text style={[styles.username, {color: colors.text}]}>
              {user.username}
            </Text>
          </View>
        )}
      </View>

      {/* 로그아웃 버튼 - 하단 고정 */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, {borderColor: colors.error}]}
          onPress={handleLogout}
          disabled={logoutMutation.isPending}>
          {logoutMutation.isPending ? (
            <ActivityIndicator color={colors.error} />
          ) : (
            <Text style={[styles.logoutButtonText, {color: colors.error}]}>
              로그아웃
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  userInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
    marginTop: 4,
  },
  logoutContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingScreen;
