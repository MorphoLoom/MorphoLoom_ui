import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons 사용

const Header = ({toggleTheme, isDarkMode}) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>MorphoLoom</Text>
      <TouchableOpacity style={styles.iconContainer} onPress={toggleTheme}>
        <Icon
          name={isDarkMode ? 'moon-outline' : 'sunny-outline'}
          size={24}
          color="black"
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
    backgroundColor: 'white',
    position: 'relative', // 상대 위치 설정
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    position: 'absolute', // 아이콘을 절대 위치로 설정
    right: 20, // 오른쪽 여백
  },
});
export default Header;
