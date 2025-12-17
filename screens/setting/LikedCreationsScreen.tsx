import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../context/ThemeContext';
import {useLikedCreations} from '../../hooks/useLikedCreations';
import {logger} from '../../utils/logger';
import type {Creation} from '../../types/api';

interface LikedCreationsScreenProps {
  navigation: any;
}

const LikedCreationsScreen: React.FC<LikedCreationsScreenProps> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useLikedCreations('latest');

  // 모든 페이지의 데이터를 평탄화
  const likedCreations = data?.pages.flatMap(page => page.items) || [];

  const renderItem = ({item}: {item: Creation}) => (
    <TouchableOpacity
      style={styles.gridImageWrapper}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('SocialDetail', {item})}>
      {item.thumbnail ? (
        <Image
          source={{uri: item.thumbnail}}
          style={styles.gridImage}
          onError={() => logger.log('Image load error:', item.thumbnail)}
        />
      ) : (
        <View style={[styles.gridImage, styles.placeholderImage]}>
          <Ionicons name="images-outline" size={40} color="#999" />
        </View>
      )}
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.loadingContainer,
          {backgroundColor: colors.background},
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 상단 헤더 */}
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
        <Text style={[styles.headerTitle, {color: colors.text}]}>
          좋아요한 창작물
        </Text>
        <View style={styles.headerRightSpace} />
      </View>

      {/* 그리드 리스트 */}
      {likedCreations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={60} color="#999" />
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            좋아요한 창작물이 없습니다
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedCreations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{padding: 20}}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  gridContainer: {
    padding: 0,
    margin: 0,
  },
  columnWrapper: {
    padding: 0,
    margin: 0,
  },
  gridImageWrapper: {
    flex: 1,
    aspectRatio: 1,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 0,
    margin: 0,
    padding: 0,
    backgroundColor: '#E0E0E0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
});

export default LikedCreationsScreen;
