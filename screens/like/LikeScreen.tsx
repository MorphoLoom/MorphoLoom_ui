import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

interface LikeScreenProps {
  navigation?: any;
}

const LikeScreen: React.FC<LikeScreenProps> = ({navigation}) => {
  const {colors} = useTheme();

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.gridImageWrapper}
      activeOpacity={0.8}
      onPress={() => navigation?.navigate('LikeDetail', {item})}>
      <Image source={{uri: item.image}} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{padding: 0, margin: 0}}
        columnWrapperStyle={{padding: 0, margin: 0}}
        key={'grid'}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3F8',
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  // toggleBtn 제거
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#222',
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
  time: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
  },
});

export default LikeScreen;
