import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const LikeScreen: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
      <Text style={{color: colors.text}}>Like Screen</Text>
    </View>
  );
};

export default LikeScreen;
