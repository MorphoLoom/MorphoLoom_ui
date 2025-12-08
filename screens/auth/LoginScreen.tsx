import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen: React.FC = () => {
  const {colors} = useTheme();
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // 로그인 로직 구현 (현재는 바로 로그인 처리)
    console.log('Login:', {email, password, rememberMe});
    login(); // 로그인 상태로 변경
  };

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

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, {color: colors.text}]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sign Up Now 버튼 */}
      <TouchableOpacity
        style={[styles.signUpButton, {backgroundColor: '#FFD6D6'}]}
        onPress={handleLogin}>
        <Text style={[styles.signUpButtonText, {color: '#000000'}]}>
          Sign Up Now
        </Text>
      </TouchableOpacity>

      {/* Login with 소셜 로그인 */}
      <Text style={[styles.loginWithText, {color: colors.text}]}>
        Login with
      </Text>

      <View style={styles.socialButtonsContainer}>
        {/* 카카오톡 */}
        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FFE812'}]}>
          <Icon name="comment" size={24} color="#000000" />
        </TouchableOpacity>

        {/* 네이버 */}
        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#03C75A'}]}>
          <Text style={styles.naverText}>N</Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#000000'}]}>
          <Icon name="apple" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Google */}
        <TouchableOpacity style={[styles.socialButton, {backgroundColor: '#FFFFFF'}]}>
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
