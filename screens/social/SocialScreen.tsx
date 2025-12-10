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

const baseImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1519985176271-adb1088fa94c',
  'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
];

const mockData = [
  {
    id: '1',
    title: '여름 바다',
    description: '휴가에서 찍은 시원한 바다 사진',
    time: '2025-12-01',
    image: baseImages[0],
  },
  {
    id: '2',
    title: '겨울 산',
    description: '눈 내린 산 정상에서 한 컷',
    time: '2025-11-28',
    image: baseImages[1],
  },
  {
    id: '3',
    title: '도시 야경',
    description: '밤에 본 도심의 불빛',
    time: '2025-11-25',
    image: baseImages[2],
  },
  {
    id: '4',
    title: '가을 단풍',
    description: '단풍잎이 아름다운 공원',
    time: '2025-11-20',
    image: baseImages[3],
  },
  {
    id: '5',
    title: '봄 꽃',
    description: '벚꽃이 만개한 거리',
    time: '2025-11-15',
    image: baseImages[4],
  },
  {
    id: '6',
    title: '강아지 산책',
    description: '강아지와 함께한 산책길',
    time: '2025-11-10',
    image: baseImages[5],
  },
  {
    id: '7',
    title: '커피 한 잔',
    description: '카페에서 마신 따뜻한 커피',
    time: '2025-11-05',
    image: baseImages[6],
  },
  {
    id: '8',
    title: '책 읽는 시간',
    description: '조용한 오후의 독서',
    time: '2025-11-01',
    image: baseImages[7],
  },
  {
    id: '9',
    title: '운동하는 날',
    description: '헬스장에서 운동하는 모습',
    time: '2025-10-28',
    image: baseImages[8],
  },
];

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

        // 임시: mockData 사용
        setTimeout(() => {
          setData(mockData);
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

        // 임시: 좋아요한 항목만 필터링 (홀수 id)
        setTimeout(() => {
          const likedData = mockData.filter(item => parseInt(item.id, 10) % 2 === 1);
          setData(likedData);
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
