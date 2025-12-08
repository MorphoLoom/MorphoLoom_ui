import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

const AlarmScreen: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
      }}>
      <Text style={{color: colors.text}}>Alarm Screen</Text>
    </View>
  );
};

export default AlarmScreen;
