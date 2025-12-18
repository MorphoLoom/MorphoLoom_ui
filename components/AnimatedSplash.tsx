import React, {useEffect, useRef} from 'react';
import {View, Animated, Image, StyleSheet, Dimensions} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const {width, height} = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({onFinish}) => {
  // 처음부터 보이게 설정 (opacity: 1)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);

  useEffect(() => {
    if (isImageLoaded) {
      // 이미지가 로드되면 네이티브 스플래시 숨김
      SplashScreen.hide();

      // 1.5초 대기 후 Fade Out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 1500);
    }
  }, [isImageLoaded, fadeAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View style={{opacity: fadeAnim}}>
        <Image
          source={require('../assets/img/js_splash.jpg')}
          style={styles.logo}
          resizeMode="contain"
          onLoadEnd={() => setIsImageLoaded(true)}
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
