import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import {useLogout} from '../../hooks/useAuth';
import {showToast} from '../../utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const SettingScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors} = useTheme();
  const {clearAuth, user, refreshTokenIfNeeded} = useAuth();
  const logoutMutation = useLogout();

  // 페이지 진입 시 토큰 갱신 체크
  useFocusEffect(
    React.useCallback(() => {
      refreshTokenIfNeeded();
    }, [refreshTokenIfNeeded]),
  );

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

  const handleProfileSettings = () => {
    showToast.info('프로필 설정', '프로필 설정 기능은 준비중입니다');
  };

  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };

  const handleLikedCreations = () => {
    navigation.navigate('LikedCreations');
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>설정</Text>

        {/* 사용자 프로필 카드 */}
        {user && (
          <>
            <View style={[styles.profileCard, {backgroundColor: colors.card}]}>
              {/* 아바타 + 닉네임 */}
              <View style={styles.profileHeader}>
                <View style={[styles.avatar, {backgroundColor: colors.primary}]}>
                  <Text style={styles.avatarText}>
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={[styles.username, {color: colors.text}]}>
                    {user.username}
                  </Text>
                  <Text style={[styles.email, {color: colors.textSecondary}]}>
                    {user.email}
                  </Text>
                </View>
              </View>
            </View>

            {/* 버튼 영역 */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.actionButton, {borderColor: colors.primary}]}
                onPress={handleProfileSettings}>
                <Text style={[styles.actionButtonText, {color: colors.primary}]}>프로필 설정</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, {borderColor: colors.primary}]}
                onPress={handleLikedCreations}>
                <Text style={[styles.actionButtonText, {color: colors.primary}]}>좋아요한 창작물</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton, {borderColor: colors.error}]}
                onPress={handleDeleteAccount}>
                <Text style={[styles.deleteButtonText, {color: colors.error}]}>
                  회원탈퇴
                </Text>
              </TouchableOpacity>
            </View>
          </>
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
  profileCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  buttonGroup: {
    gap: 12,
  },
  actionButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
