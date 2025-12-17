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
  useSignup,
  useSendVerification,
  useVerifyEmail,
} from '../../hooks/useAuth';
import {showToast} from '../../utils/toast';
import {logger} from '../../utils/logger';

interface SignUpScreenProps {
  onBack: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({onBack}) => {
  const {colors} = useTheme();
  const signupMutation = useSignup();
  const sendVerificationMutation = useSendVerification();
  const verifyEmailMutation = useVerifyEmail();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
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

    sendVerificationMutation.mutate(
      {email},
      {
        onSuccess: () => {
          setIsVerificationSent(true);
          showToast.success(
            '인증번호 발송',
            '이메일로 인증번호가 발송되었습니다',
          );
        },
        onError: (error: any) => {
          logger.error('인증번호 발송 에러:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            '인증번호 발송 중 오류가 발생했습니다';
          showToast.error('인증번호 발송 실패', errorMessage);
        },
      },
    );
  };

  // 이메일 인증번호 확인
  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      showToast.error('인증번호를 입력해주세요');
      return;
    }

    verifyEmailMutation.mutate(
      {
        email,
        verificationCode,
      },
      {
        onSuccess: () => {
          setIsEmailVerified(true);
          showToast.success('인증 완료', '이메일 인증이 완료되었습니다');
        },
        onError: (error: any) => {
          logger.error('이메일 인증 에러:', error);
          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            '인증번호가 올바르지 않습니다';
          showToast.error('인증 실패', errorMessage);
        },
      },
    );
  };

  const handleSignUp = async () => {
    // 입력값 검증
    if (!email || !password || !confirmPassword || !username) {
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

    // 사용자 이름 길이 검증
    if (username.length < 2) {
      showToast.error('사용자 이름은 2자 이상이어야 합니다');
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      showToast.error('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      showToast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    try {
      await signupMutation.mutateAsync({
        email,
        password,
        username,
      });

      showToast.success('회원가입 완료', '로그인 페이지로 이동합니다');

      // 로그인 페이지로 이동
      onBack();
    } catch (error: any) {
      logger.error('회원가입 에러:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '회원가입 중 오류가 발생했습니다';
      showToast.error('회원가입 실패', errorMessage);
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
      <Text style={[styles.title, {color: colors.text}]}>회원가입</Text>

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
              verifyEmailMutation.isPending || verificationCode.length !== 6
            }>
            {verifyEmailMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>확인</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Username 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="사용자 이름"
        placeholderTextColor={colors.text + '60'}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* 비밀번호 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="비밀번호"
        placeholderTextColor={colors.text + '60'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 비밀번호 확인 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="비밀번호 확인"
        placeholderTextColor={colors.text + '60'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Sign Up 버튼 */}
      <TouchableOpacity
        style={[styles.signUpButton, {backgroundColor: colors.primary}]}
        onPress={handleSignUp}
        disabled={signupMutation.isPending}>
        {signupMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.signUpButtonText, {color: '#FFFFFF'}]}>
            가입하기
          </Text>
        )}
      </TouchableOpacity>

      {/* 로그인으로 돌아가기 */}
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, {color: colors.textSecondary}]}>
          이미 계정이 있으신가요?{' '}
        </Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.loginLink, {color: colors.primary}]}>로그인</Text>
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
  signUpButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  signUpButtonText: {
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

export default SignUpScreen;
