import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../context/ThemeContext';

interface LikeDetailScreenProps {
  route: {
    params: {
      item: {
        id: string;
        title: string;
        description: string;
        time: string;
        image: string;
      };
    };
  };
  navigation: any;
}

const LikeDetailScreen: React.FC<LikeDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {colors} = useTheme();
  const {item} = route.params;
  const [liked, setLiked] = useState(false);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 상단 헤더 영역 */}
      <View style={[styles.header, {backgroundColor: colors.background}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Ionicons
            name="arrow-back-outline"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, {color: colors.text}]}
          numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.headerRightSpace} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 이미지 */}
        <Image source={{uri: item.image}} style={styles.image} />

        {/* 정보 영역 */}
        <View style={styles.infoContainer}>
          <TouchableOpacity
            style={[
              styles.likeButton,
              {
                backgroundColor: liked ? colors.primary : colors.background,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setLiked(!liked)}
            activeOpacity={0.7}>
            <Ionicons
              name={liked ? 'star' : 'star-outline'}
              size={24}
              color={liked ? '#fff' : colors.primary}
            />
          </TouchableOpacity>
          <Text style={[styles.time, {color: colors.textSecondary}]}>
            {item.time}
          </Text>
          <Text style={[styles.description, {color: colors.text}]}>
            {item.description}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRightSpace: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    backgroundColor: '#E0E0E0',
  },
  infoContainer: {
    padding: 20,
    position: 'relative',
  },
  likeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  time: {
    fontSize: 14,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default LikeDetailScreen;
