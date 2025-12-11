import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {MOCK_SOCIAL_POSTS, MOCK_LIKED_POSTS} from '../../constants/mockData';

interface SocialScreenProps {
  navigation?: any;
}

// 전체 그리드 컴포넌트
const AllGridTab: React.FC<{navigation?: any}> = ({navigation}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 전체 게시물 API 호출
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        // const response = await fetch('YOUR_API_ENDPOINT/posts');
        // const result = await response.json();
        // setData(result);

        // 임시: MOCK_SOCIAL_POSTS 사용
        setTimeout(() => {
          setData(MOCK_SOCIAL_POSTS);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('전체 게시물 로드 실패:', error);
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.gridImageWrapper}
      activeOpacity={0.8}
      onPress={() => navigation?.navigate('SocialDetail', {item})}>
      <Image source={{uri: item.image}} style={styles.gridImage} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.columnWrapper}
      key={'grid'}
      showsVerticalScrollIndicator={false}
    />
  );
};

// 좋아요 그리드 컴포넌트
const LikeGridTab: React.FC<{navigation?: any}> = ({navigation}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 좋아요한 게시물 API 호출
    const fetchLikedPosts = async () => {
      try {
        setLoading(true);
        // const response = await fetch('YOUR_API_ENDPOINT/posts/liked');
        // const result = await response.json();
        // setData(result);

        // 임시: MOCK_LIKED_POSTS 사용
        setTimeout(() => {
          setData(MOCK_LIKED_POSTS);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('좋아요 게시물 로드 실패:', error);
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.gridImageWrapper}
      activeOpacity={0.8}
      onPress={() => navigation?.navigate('SocialDetail', {item})}>
      <Image source={{uri: item.image}} style={styles.gridImage} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C4DFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.columnWrapper}
      key={'grid-like'}
      showsVerticalScrollIndicator={false}
    />
  );
};

const SocialScreen: React.FC<SocialScreenProps> = ({navigation}) => {
  const {colors} = useTheme();
  const [activeTab, setActiveTab] = useState<'all' | 'like'>('all');

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
          style={[styles.tabButton, activeTab === 'like' && styles.activeTab]}
          onPress={() => setActiveTab('like')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'like' && styles.activeTabText,
            ]}>
            좋아요
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
});

export default SocialScreen;
