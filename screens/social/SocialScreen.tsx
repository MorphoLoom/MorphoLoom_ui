import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../context/ThemeContext';
import {useCreations, useMyCreations} from '../../hooks/useSocialPosts';
import {logger} from '../../utils/logger';
import type {Creation} from '../../types/api';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

interface SocialScreenProps {
  navigation?: any;
}

// 전체 그리드 컴포넌트
const AllGridTab: React.FC<{navigation?: any}> = ({navigation}) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useCreations('latest');

  // 모든 페이지의 데이터를 평탄화
  const creations = data?.pages.flatMap(page => page.items) || [];

  const renderItem = ({item}: {item: Creation}) => (
    <TouchableOpacity
      style={styles.gridImageWrapper}
      activeOpacity={0.8}
      onPress={() => navigation?.navigate('SocialDetail', {item})}>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={creations}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.columnWrapper}
      key={'grid'}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#7C4DFF" style={{padding: 20}} />
        ) : null
      }
    />
  );
};

// 내 창작물 그리드 컴포넌트
const LikeGridTab: React.FC<{navigation?: any}> = ({navigation}) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyCreations('latest');

  // 모든 페이지의 데이터를 평탄화
  const myCreations = data?.pages.flatMap(page => page.items) || [];

  const renderItem = ({item}: {item: Creation}) => (
    <TouchableOpacity
      style={styles.gridImageWrapper}
      activeOpacity={0.8}
      onPress={() => navigation?.navigate('SocialDetail', {item, isMyCreation: true})}>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={myCreations}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.columnWrapper}
      key={'grid-like'}
      showsVerticalScrollIndicator={false}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="small" color="#7C4DFF" style={{padding: 20}} />
        ) : null
      }
    />
  );
};

const SocialScreen: React.FC<SocialScreenProps> = ({navigation}) => {
  const {colors} = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 탭 헤더 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText,
            ]}>
            전체
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'my' && styles.activeTabText,
            ]}>
            내 창작물
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 컨텐츠 */}
      {activeTab === 'all' ? (
        <AllGridTab navigation={navigation} />
      ) : (
        <LikeGridTab navigation={navigation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#7C4DFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999999',
  },
  activeTabText: {
    color: '#7C4DFF',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
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

export default SocialScreen;
