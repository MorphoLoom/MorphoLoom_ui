import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';

const SettingScreen: React.FC = () => {
  const {colors} = useTheme();
  const {logout, userData} = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>Settings</Text>

        {/* 사용자 정보 표시 */}
        {userData && (
          <View style={[styles.userInfo, {backgroundColor: colors.card}]}>
            <Text style={[styles.label, {color: colors.textSecondary}]}>
              Logged in as:
            </Text>
            <Text style={[styles.email, {color: colors.text}]}>
              {userData.email}
            </Text>
          </View>
        )}
      </View>

      {/* 로그아웃 버튼 - 하단 고정 */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, {borderColor: colors.error}]}
          onPress={handleLogout}>
          <Text style={[styles.logoutButtonText, {color: colors.error}]}>
            Logout
          </Text>
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
