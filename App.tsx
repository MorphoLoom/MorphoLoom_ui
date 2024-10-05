import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Header from './app/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';

function HomeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

function RankingScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Ranking Screen</Text>
    </View>
  );
}
function AlarmScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Alarm Screen</Text>
    </View>
  );
}
function LikeScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Like Screen</Text>
    </View>
  );
}
function SettingScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Setting Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const systemColorScheme = useColorScheme(); // 시스템 기본 테마 감지
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000); //스플래시 활성화 시간
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev); // 테마 전환
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
    flex: 1, // SafeAreaView가 전체 화면을 차지하도록 설정
  };

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        {/* Tab.Navigator는 독립적으로 사용해야 하므로 다른 컨테이너로 감싸지 않습니다. */}
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: () => {
                return null;
              },
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
              tabBarLabel: () => {
                return null;
              },
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
              tabBarLabel: () => {
                return null;
              },
              tabBarIcon: ({color, size}) => (
                <Icon name="notifications-outline" color={color} size={size} />
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Like"
            component={LikeScreen}
            options={{
              tabBarLabel: () => {
                return null;
              },
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
              tabBarLabel: () => {
                return null;
              },
              tabBarIcon: ({color, size}) => (
                <Icon name="settings-outline" color={color} size={size} />
              ),
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default App;
