import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

export const BreathingLoader = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/img/js_splash.jpg')}
        style={[
          styles.loaderImage,
          {
            opacity: opacity,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
  loaderImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
});
