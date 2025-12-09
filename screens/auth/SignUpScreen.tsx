import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';

interface SignUpScreenProps {
  onBack: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({onBack}) => {
  const {colors} = useTheme();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignUp = () => {
    // 입력값 검증
    if (!email || !password || !confirmPassword || !nickname) {
      console.log('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      return;
    }

    // 회원가입 성공 후 자동 로그인 (나중에 API 연동 시 수정)
    console.log('Sign up:', {email, nickname});
    login(email, password, false);
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      contentContainerStyle={styles.contentContainer}>
      {/* 제목 */}
      <Text style={[styles.title, {color: colors.text}]}>Register</Text>

      {/* Nickname 입력 */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Nickname"
        placeholderTextColor={colors.text + '60'}
        value={nickname}
        onChangeText={setNickname}
        autoCapitalize="none"
      />

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
        placeholder="Confirm Password"
        placeholderTextColor={colors.text + '60'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {/* Sign Up 버튼 */}
      <TouchableOpacity
        style={[styles.signUpButton, {backgroundColor: colors.primary}]}
        onPress={handleSignUp}>
        <Text style={[styles.signUpButtonText, {color: '#FFFFFF'}]}>
          Sign Up
        </Text>
      </TouchableOpacity>

      {/* 로그인으로 돌아가기 */}
      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, {color: colors.textSecondary}]}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.loginLink, {color: colors.primary}]}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
