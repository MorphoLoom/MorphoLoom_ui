import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth as useAuthContext} from '../../context/AuthContext';
import {useLogin} from '../../hooks/useAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import {showToast} from '../../utils/toast';
import SignUpScreen from './SignUpScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

const LoginScreen: React.FC = () => {
  const {colors} = useTheme();
  const {setAuthData} = useAuthContext();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async () => {
    // 입력값 검증
    if (!email || !password) {
      showToast.error('이메일과 비밀번호를 입력해주세요');
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({email, password});

      // AuthContext에 토큰과 사용자 정보 저장
      await setAuthData(
        response.accessToken,
        response.refreshToken,
        response.user,
      );

      // 새 사용자인 경우 추가 안내
      if (response.isNewUser) {
        showToast.success('환영합니다!', 'MorphoLoom에 오신 것을 환영합니다!');
      }
    } catch (error: any) {
      console.error('로그인 에러:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        '이메일 또는 비밀번호가 올바르지 않습니다';
      showToast.error('로그인 실패', errorMessage);
    }
  };

  // Sign Up 화면이 활성화되면 SignUpScreen 표시
  if (showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} />;
  }

  // Forgot Password 화면이 활성화되면 ForgotPasswordScreen 표시
  if (showForgotPassword) {
    return (
      <ForgotPasswordScreen onBack={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 로고/타이틀 */}
      <Text style={[styles.title, {color: colors.text}]}>MorphoLoom</Text>

      {/* 이메일 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.text + '60'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        placeholder="Password"
        placeholderTextColor={colors.text + '60'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Remember me & Forgot password */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.rememberMe}
          onPress={() => setRememberMe(!rememberMe)}>
          <View
            style={[
              styles.checkbox,
              {borderColor: colors.border},
              rememberMe && {backgroundColor: colors.primary},
            ]}>
            {rememberMe && <Icon name="check" size={12} color="white" />}
          </View>
          <Text style={[styles.rememberMeText, {color: colors.text}]}>
            Remember me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
          <Text style={[styles.forgotPassword, {color: colors.text}]}>
            비밀번호 찾기
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login 버튼 */}
      <TouchableOpacity
        style={[styles.loginButton, {backgroundColor: colors.primary}]}
        onPress={handleLogin}
        disabled={loginMutation.isPending}>
        {loginMutation.isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={[styles.loginButtonText, {color: '#FFFFFF'}]}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* Sign Up Now 버튼 */}
      <TouchableOpacity
        style={[styles.signUpButton, {backgroundColor: colors.accent}]}
        onPress={() => setShowSignUp(true)}>
        <Text style={[styles.signUpButtonText, {color: colors.primaryDark}]}>
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* Login with 소셜 로그인 */}
      <Text style={[styles.loginWithText, {color: colors.text}]}>
        Login with
      </Text>

      <View style={styles.socialButtonsContainer}>
        {/* 카카오톡 */}
        <TouchableOpacity
          style={[styles.socialButton, {backgroundColor: '#FFE812'}]}>
          <Icon name="comment" size={24} color="#000000" />
        </TouchableOpacity>

        {/* 네이버 */}
        <TouchableOpacity
          style={[styles.socialButton, {backgroundColor: '#03C75A'}]}>
          <Text style={styles.naverText}>N</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity
          style={[styles.socialButton, {backgroundColor: '#000000'}]}>
          <Icon name="apple" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Google */}
        <TouchableOpacity
          style={[styles.socialButton, {backgroundColor: '#FFFFFF'}]}>
          <Icon name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
  },
  input: {
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
  },
  forgotPassword: {
    fontSize: 14,
  },
  loginButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginWithText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  naverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default LoginScreen;
