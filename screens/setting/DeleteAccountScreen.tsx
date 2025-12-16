import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import {useDeleteAccount} from '../../hooks/useAuth';
import {showToast} from '../../utils/toast';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteAccountScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors} = useTheme();
  const {user, clearAuth} = useAuth();
  const [password, setPassword] = useState('');
  const deleteAccountMutation = useDeleteAccount();

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      showToast.error('비밀번호 입력', '비밀번호를 입력해주세요');
      return;
    }

    if (!user?.email) {
      showToast.error('오류', '사용자 정보를 찾을 수 없습니다');
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync({
        email: user.email,
        password: password,
      });

      // 로컬 데이터 삭제
      await AsyncStorage.clear();
      await clearAuth();

      showToast.success('탈퇴 완료', '계정이 성공적으로 삭제되었습니다');

      // 로그인 화면으로 이동 (네비게이션은 AuthContext에서 자동 처리됨)
    } catch (error: any) {
      const errorMessage = error?.message || '다시 시도해주세요';
      showToast.error('탈퇴 실패', errorMessage);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 헤더 */}
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.text}]}>
          회원탈퇴
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* 경고 메시지 */}
        <View style={[styles.warningCard, {backgroundColor: colors.card}]}>
          <Icon name="warning" size={48} color={colors.error} />
          <Text style={[styles.warningTitle, {color: colors.error}]}>
            회원탈퇴 주의사항
          </Text>
          <Text style={[styles.warningText, {color: colors.textSecondary}]}>
            • 모든 개인정보가 삭제됩니다{'\n'}
            • 작성한 게시물과 댓글이 삭제됩니다{'\n'}
            • 탈퇴 후 동일 계정으로 재가입이 불가능합니다{'\n'}
            • 삭제된 데이터는 복구할 수 없습니다
          </Text>
        </View>

        {/* 이메일 정보 */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: colors.textSecondary}]}>
            탈퇴 계정
          </Text>
          <View style={[styles.emailBox, {backgroundColor: colors.card}]}>
            <Text style={[styles.emailText, {color: colors.text}]}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.section}>
          <Text style={[styles.label, {color: colors.textSecondary}]}>
            비밀번호 확인
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="비밀번호를 입력하세요"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.helperText, {color: colors.textSecondary}]}>
          본인 확인을 위해 비밀번호를 입력해주세요
        </Text>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            {backgroundColor: colors.error},
            (!password.trim() || deleteAccountMutation.isPending) && styles.disabledButton,
          ]}
          onPress={handleDeleteAccount}
          disabled={!password.trim() || deleteAccountMutation.isPending}>
          {deleteAccountMutation.isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.deleteButtonText}>계정 탈퇴하기</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  warningCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 24,
    textAlign: 'left',
    width: '100%',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  emailBox: {
    padding: 16,
    borderRadius: 12,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  deleteButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default DeleteAccountScreen;
