import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface BreathingLoaderProps {
  showCancelButton?: boolean;
  onCancel?: () => void;
}

export const BreathingLoader = ({showCancelButton, onCancel}: BreathingLoaderProps) => {
  const {colors} = useTheme();
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
      {showCancelButton && onCancel && (
        <TouchableOpacity
          style={[styles.cancelButton, {backgroundColor: colors.primary}]}
          onPress={onCancel}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  loaderImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
