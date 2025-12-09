import React from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants/colors';
import {useTheme} from '../../context/ThemeContext';

const mockData = [
  {
    id: '1',
    title: 'Title 1',
    description: 'Description 1',
    time: '9:41 AM',
    image: 'https://via.placeholder.com/48',
  },
  {
    id: '2',
    title: 'Title 2',
    description: 'Description 2',
    time: '9:42 AM',
    image: 'https://via.placeholder.com/48',
  },
  {
    id: '3',
    title: 'Title 3',
    description: 'Description 3',
    time: '9:43 AM',
    image: 'https://via.placeholder.com/48',
  },
  {
    id: '4',
    title: 'Title 4',
    description: 'Description 4',
    time: '9:44 AM',
    image: 'https://via.placeholder.com/48',
  },
];

const RankingScreen = () => {
  const {colors} = useTheme();
  // 1~3등 분리 (1등, 2등, 3등 순서로)
  const top3 = [mockData[1], mockData[0], mockData[2]];
  const rest = mockData.slice(3);

  const renderTopCircle = (item, rank) => {
    // 0: 2등(왼쪽), 1: 1등(가운데), 2: 3등(오른쪽)
    const positions = [
      styles.topCircleLeft,
      styles.topCircleCenter,
      styles.topCircleRight,
    ];
    const realRank = rank === 0 ? 2 : rank === 1 ? 1 : 3;
    return (
      <View style={[styles.topCircle, positions[rank]]} key={item.id}>
        {realRank === 1 && (
          <Ionicons
            name="trophy"
            size={20}
            color="#FFD700"
            style={styles.crownIcon}
          />
        )}
        <View style={styles.topCircleBadge}>
          <Text style={styles.topCircleRank}>{realRank}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.image}} style={styles.topCircleImage} />
        </View>
        <Text style={[styles.topCircleTitle, {color: colors.text}]}>
          {item.title}
        </Text>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <View style={[styles.listItem, {backgroundColor: colors.card}]}>
      <Image source={{uri: item.image}} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, {color: colors.text}]}>{item.title}</Text>
        <Text style={[styles.description, {color: colors.textSecondary}]}>
          {item.description}
        </Text>
      </View>
      <Text style={[styles.time, {color: colors.textSecondary}]}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>Ranking</Text>
      </View>
      <View style={styles.topCircleRow}>
        {renderTopCircle(top3[0], 0)}
        {renderTopCircle(top3[1], 1)}
        {renderTopCircle(top3[2], 2)}
      </View>
      <FlatList
        data={rest}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingVertical: 8, paddingHorizontal: 0}}
        numColumns={1}
        key={'list'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  topCircleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 12,
    height: 140,
  },
  topCircle: {
    alignItems: 'center',
    width: 90,
    position: 'relative',
  },
  topCircleLeft: {
    marginBottom: 15, // 2등(왼쪽)
  },
  topCircleCenter: {
    marginBottom: 30, // 1등(가운데) - 가장 위
  },
  topCircleRight: {
    marginBottom: 15, // 3등(오른쪽) - 2등과 같은 위치
  },
  crownIcon: {
    position: 'absolute',
    top: -38,
    zIndex: 3,
  },
  imageContainer: {
    marginBottom: 4,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  topCircleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  topCircleBadge: {
    position: 'absolute',
    top: -14,
    left: 32,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    backgroundColor: '#fff',
    zIndex: 2,
  },
  topCircleRank: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  topCircleTitle: {
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
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
  },
  description: {
    fontSize: 13,
  },
  time: {
    fontSize: 13,
    marginLeft: 8,
  },
});

export default RankingScreen;
