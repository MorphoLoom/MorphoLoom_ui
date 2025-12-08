import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../context/ThemeContext';

const Header = () => {
  const {isDarkMode, toggleTheme, colors} = useTheme();

  return (
    <View
      style={[
        styles.headerContainer,
        {backgroundColor: colors.background, borderBottomColor: colors.border},
      ]}>
      <Text style={[styles.headerText, {color: colors.text}]}>MorphoLoom</Text>
      <TouchableOpacity style={styles.iconContainer} onPress={toggleTheme}>
        <Icon
          name={isDarkMode ? 'moon-outline' : 'sunny-outline'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'relative',
    borderBottomWidth: 1,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 20,
  },
});
export default Header;
