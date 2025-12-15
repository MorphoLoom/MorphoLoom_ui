import React, {useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../constants/colors';
import {useTheme} from '../../context/ThemeContext';
import {useCreationRankings} from '../../hooks/useRanking';

interface RankingScreenProps {
  navigation?: any;
}

const RankingScreen: React.FC<RankingScreenProps> = ({navigation}) => {
  const {colors} = useTheme();
  const {data: rankings, isLoading, error} = useCreationRankings();

  // 1~3등 분리 (2등, 1등, 3등 순서로 배치)
  const {top3, rest} = useMemo(() => {
    if (!rankings || rankings.length === 0) {
      return {top3: [null, null, null], rest: []};
    }

    // rankScore가 모두 0이면 likes 순으로 정렬
    const needsSorting = rankings.every(item => item.rankScore === 0);
    const sorted = needsSorting
      ? [...rankings].sort((a, b) => b.likes - a.likes)
      : rankings;

    const topThree = sorted.slice(0, 3);
    const remaining = sorted.slice(3);

    // Top 3 플레이스홀더 (항상 3개 유지)
    const paddedTop3 = [
      topThree[0] || null,
      topThree[1] || null,
      topThree[2] || null,
    ];

    // UI 배치를 위해 [2등, 1등, 3등] 순서로 재정렬
    const reordered = [paddedTop3[1], paddedTop3[0], paddedTop3[2]];

    return {top3: reordered, rest: remaining};
  }, [rankings]);

  // 애니메이션 값들
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const top3Anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    // Top 3 순차적 등장 (2등, 1등, 3등 순서)
    Animated.stagger(
      100,
      top3Anims.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ),
    ).start();

    // 리스트 fade-in + slide-up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderTopCircle = (item, rank) => {
    // 0: 2등(왼쪽), 1: 1등(가운데), 2: 3등(오른쪽)
    const positions = [
      styles.topCircleLeft,
      styles.topCircleCenter,
      styles.topCircleRight,
    ];
    const realRank = rank === 0 ? 2 : rank === 1 ? 1 : 3;

    const animatedStyle = {
      opacity: top3Anims[rank],
      transform: [
        {
          scale: top3Anims[rank].interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
          }),
        },
        {
          translateY: top3Anims[rank].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    // 빈 데이터 플레이스홀더
    if (!item) {
      return (
        <Animated.View
          style={[styles.topCircle, positions[rank], animatedStyle]}
          key={`empty-${rank}`}>
          <View style={styles.topCircleBadge}>
            <Text style={styles.topCircleRank}>{realRank}</Text>
          </View>
          <View style={styles.imageContainer}>
            <View style={[styles.topCircleImage, styles.emptyCircle]}>
              <Ionicons
                name="person-outline"
                size={32}
                color={colors.textSecondary}
              />
            </View>
          </View>
          <Text style={[styles.topCircleTitle, {color: colors.textSecondary}]}>
            -
          </Text>
        </Animated.View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation?.navigate('SocialDetail', {item})}
        key={item.id}>
        <Animated.View
          style={[styles.topCircle, positions[rank], animatedStyle]}>
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
            <Image
              source={{uri: item.thumbnail}}
              style={styles.topCircleImage}
            />
          </View>
          <Text
            style={[styles.topCircleTitle, {color: colors.text}]}
            numberOfLines={1}>
            {item.title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation?.navigate('SocialDetail', {item})}>
      <Animated.View
        style={[
          styles.listItem,
          {
            backgroundColor: colors.card,
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          },
        ]}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNumber}>{index + 4}</Text>
        </View>
        <Image
          source={{uri: item.thumbnail}}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, {color: colors.text}]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text
            style={[styles.description, {color: colors.textSecondary}]}
            numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={14} color={COLORS.primary} />
            <Text style={[styles.statText, {color: colors.textSecondary}]}>
              {item.likes}
            </Text>
          </View>
          <Text style={[styles.scoreText, {color: colors.text}]}>
            {item.rankScore.toFixed(0)}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.loadingText, {color: colors.textSecondary}]}>
          랭킹 불러오는 중...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer, {backgroundColor: colors.background}]}>
        <Ionicons name="alert-circle" size={48} color={colors.textSecondary} />
        <Text style={[styles.errorText, {color: colors.text}]}>
          랭킹을 불러올 수 없습니다
        </Text>
        <Text style={[styles.errorSubText, {color: colors.textSecondary}]}>
          {error.message || '잠시 후 다시 시도해주세요'}
        </Text>
      </View>
    );
  }

  // 빈 상태일 때도 Top 3는 표시 (플레이스홀더로)

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>랭킹</Text>
      </View>
      <View style={styles.topCircleRow}>
        {top3.map((item, index) => renderTopCircle(item, index))}
      </View>
      {rest.length > 0 ? (
        <FlatList
          data={rest}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContentContainer}
          numColumns={1}
          key={'list'}
        />
      ) : rankings && rankings.length > 0 ? (
        <View style={styles.emptyRestContainer}>
          <Ionicons
            name="sparkles-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyText, {color: colors.text}]}>
            더 많은 창작물을 기다리고 있어요!
          </Text>
          <Text style={[styles.emptySubText, {color: colors.textSecondary}]}>
            당신의 멋진 작품으로 랭킹을 채워주세요
          </Text>
        </View>
      ) : (
        <View style={styles.emptyRestContainer}>
          <Ionicons
            name="trophy-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyText, {color: colors.text}]}>
            첫 번째 창작자가 되어보세요!
          </Text>
          <Text style={[styles.emptySubText, {color: colors.textSecondary}]}>
            지금 바로 작품을 만들어 랭킹에 올라보세요
          </Text>
        </View>
      )}
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
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  statsContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  errorSubText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  emptyRestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  listContentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
});

export default RankingScreen;
