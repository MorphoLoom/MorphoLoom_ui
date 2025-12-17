import React, {useEffect, useRef} from 'react';
import {View, Animated, Image, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({onFinish}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade In (600ms)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      // 1초 대기 후 Fade Out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 1000);
    });
  }, [fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity: fadeAnim}}>
        <Image
          source={require('../assets/img/js_splash.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: height * 0.25,
  },
});
