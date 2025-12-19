import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './app/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {AnimatedSplash} from './components/AnimatedSplash';
import {
  LoginScreen,
  HomeScreen,
  RankingScreen,
  SocialScreen,
  SocialDetailScreen,
  SettingScreen,
  DeleteAccountScreen,
  LikedCreationsScreen,
} from './screens';
import {ThemeProvider, useTheme, AuthProvider, useAuth} from './context';
import {QueryProvider} from './context/QueryProvider';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SocialStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SocialMain" component={SocialScreen} />
      <Stack.Screen
        name="SocialDetail"
        component={SocialDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

function RankingStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="RankingMain" component={RankingScreen} />
      <Stack.Screen
        name="SocialDetail"
        component={SocialDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

function SettingStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SettingMain" component={SettingScreen} />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="LikedCreations"
        component={LikedCreationsScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="SocialDetail"
        component={SocialDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs(): React.JSX.Element {
  const {isDarkMode, colors} = useTheme();
  const [isTabLoading, setIsTabLoading] = useState(false);

  const backgroundStyle = {
    backgroundColor: colors.background,
    flex: 1,
  };

  const handleTabPress = () => {
    setIsTabLoading(true);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 300);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Header />
      {isTabLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 9999,
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          unmountOnBlur: true,
        }}
        screenListeners={{
          tabPress: handleTabPress,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="person-circle-outline" color={color} size={30} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Ranking"
          component={RankingStack}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="star-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Social"
          component={SocialStack}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="people-circle-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingStack}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="settings-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

function AppContent(): React.JSX.Element {
  const {isLoggedIn, isLoading} = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // JS Splash 표시 중
  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />;
  }

  // 인증 로딩 중
  if (isLoading) {
    return <View style={{flex: 1, backgroundColor: '#FFFFFF'}} />;
  }

  // 로그인 안 됨
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // 메인 앱
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
          <Toast />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
