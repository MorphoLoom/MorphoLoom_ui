import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Header from './app/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';
import {
  LoginScreen,
  HomeScreen,
  RankingScreen,
  AlarmScreen,
  LikeScreen,
  LikeDetailScreen,
  SettingScreen,
} from './screens';
import {ThemeProvider, useTheme, AuthProvider, useAuth} from './context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function LikeStack(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LikeMain" component={LikeScreen} />
      <Stack.Screen
        name="LikeDetail"
        component={LikeDetailScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs(): React.JSX.Element {
  const {isDarkMode, colors} = useTheme();

  const backgroundStyle = {
    backgroundColor: colors.background,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
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
          component={RankingScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="star-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Alarm"
          component={AlarmScreen}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="notifications-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Like"
          component={LikeStack}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({color, size}) => (
              <Icon name="heart-outline" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
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
  const {isLoggedIn} = useAuth();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
