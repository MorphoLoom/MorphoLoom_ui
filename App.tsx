import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, View, ActivityIndicator} from 'react-native';
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
  SocialScreen,
  SocialDetailScreen,
  SettingScreen,
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
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
