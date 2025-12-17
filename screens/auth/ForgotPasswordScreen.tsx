import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {
  useSendVerification,
  useVerifyEmail,
  useResetPassword,
} from '../../hooks/useAuth';
import {showToast} from '../../utils/toast';
import {logger} from '../../utils/logger';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
}) => {
  const {colors} = useTheme();
  const sendVerificationMutation = useSendVerification();
  const verifyEmailMutation = useVerifyEmail();
  const resetPasswordMutation = useResetPassword();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // 이메일 인증번호 발송
  const handleSendVerification = async () => {
    if (!email) {
      showToast.error('이메일을 입력해주세요');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast.error('올바른 이메일 형식을 입력해주세요');
      return;
    }

    try {
      await sendVerificationMutation.mutateAsync({email});
      setIsVerificationSent(true);
      showToast.success('인증번호 발송', '이메일로 인증번호가 발송되었습니다');
    } catch (error: any) {
      logger.error('인증번호 발송 에러:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '인증번호 발송 중 오류가 발생했습니다';
      showToast.error('인증번호 발송 실패', errorMessage);
    }
  };

  // 이메일 인증번호 확인
  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      showToast.error('인증번호를 입력해주세요');
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({
        email,
        verificationCode,
      });
      setIsEmailVerified(true);
      showToast.success('인증 완료', '이메일 인증이 완료되었습니다');
    } catch (error: any) {
      logger.error('이메일 인증 에러:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '인증번호가 올바르지 않습니다';
      showToast.error('인증 실패', errorMessage);
    }
  };

  const handleResetPassword = async () => {
    // 입력값 검증
    if (!email || !verificationCode || !newPassword || !confirmPassword) {
      showToast.error('모든 필드를 입력해주세요');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast.error('올바른 이메일 형식을 입력해주세요');
      return;
    }

    // 이메일 인증 확인
    if (!isEmailVerified) {
      showToast.error('이메일 인증을 완료해주세요');
      return;
    }

    // 비밀번호 길이 검증
    if (newPassword.length < 6) {
      showToast.error('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    // 비밀번호 일치 확인
    if (newPassword !== confirmPassword) {
      showToast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email,
        newPassword,
      });

      showToast.success('비밀번호 재설정 완료', '새 비밀번호로 로그인해주세요');
      // 잠시 후 로그인 화면으로 돌아가기
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error: any) {
      logger.error('비밀번호 재설정 에러:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '비밀번호 재설정 중 오류가 발생했습니다';
      showToast.error('비밀번호 재설정 실패', errorMessage);
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={styles.contentContainer}>
      {/* 상단 뒤로가기 아이콘 버튼 */}
      <TouchableOpacity
        style={[styles.iconBackButton, {backgroundColor: colors.primary}]}
        onPress={onBack}
        activeOpacity={0.7}>
        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
      </TouchableOpacity>
      {/* 제목 */}
      <Text style={[styles.title, {color: colors.text}]}>
        비밀번호 찾기
      </Text>

      {/* 이메일 입력 + 인증 버튼 */}
      <View style={styles.inputWithButton}>
        <TextInput
          style={[
            styles.inputFlex,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="이메일"
          placeholderTextColor={colors.text + '60'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isEmailVerified}
        />
        <TouchableOpacity
          style={[
            styles.verifyButton,
            {
              backgroundColor: isEmailVerified
                ? colors.border
                : colors.primary,
            },
          ]}
          onPress={handleSendVerification}
          disabled={
            sendVerificationMutation.isPending || isEmailVerified
          }>
          {sendVerificationMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>
              {isEmailVerified ? '인증완료' : '인증'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 인증번호 입력 + 확인 버튼 (인증번호 발송 후 표시) */}
      {isVerificationSent && (
        <View style={styles.inputWithButton}>
          <TextInput
            style={[
              styles.inputFlex,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="인증번호"
            placeholderTextColor={colors.text + '60'}
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
          />
          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor:
                  verificationCode.length === 6 ? colors.primary : colors.border,
              },
            ]}
            onPress={handleVerifyEmail}
            disabled={
              verificationCode.length !== 6 || verifyEmailMutation.isPending
            }>
            {verifyEmailMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>확인</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 새 비밀번호 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="새 비밀번호"
        placeholderTextColor={colors.text + '60'}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      {/* 새 비밀번호 확인 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="새 비밀번호 확인"
        placeholderTextColor={colors.text + '60'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* 확인 버튼 */}
      <TouchableOpacity
        style={[styles.resetButton, {backgroundColor: colors.primary}]}
        onPress={handleResetPassword}
        disabled={resetPasswordMutation.isPending}>
        {resetPasswordMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.resetButtonText, {color: '#FFFFFF'}]}>
            확인
          </Text>
        )}
      </TouchableOpacity>

      {/* 로그인으로 돌아가기 */}
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, {color: colors.textSecondary}]}>
          비밀번호가 기억나셨나요?{' '}
        </Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.loginLink, {color: colors.primary}]}>
            로그인
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  iconBackButton: {
    marginBottom: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  inputFlex: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    fontSize: 16,
  },
  verifyButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  resetButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
