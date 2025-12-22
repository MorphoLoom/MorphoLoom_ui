import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Skeleton, CircleSkeleton} from '../Skeleton';
import {useTheme} from '../../context';

// Top3 원형 스켈레톤
const TopCircleSkeleton: React.FC<{position: 'left' | 'center' | 'right'}> = ({
  position,
}) => {
  const positionStyle =
    position === 'left'
      ? styles.topCircleLeft
      : position === 'center'
      ? styles.topCircleCenter
      : styles.topCircleRight;

  return (
    <View style={[styles.topCircle, positionStyle]}>
      {/* 순위 뱃지 */}
      <View style={styles.badgeContainer}>
        <CircleSkeleton size={28} />
      </View>
      {/* 프로필 이미지 */}
      <CircleSkeleton size={80} style={styles.profileImage} />
      {/* 제목 */}
      <Skeleton width={60} height={12} borderRadius={6} style={styles.title} />
    </View>
  );
};

// 리스트 아이템 스켈레톤
const ListItemSkeleton: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.listItem, {backgroundColor: colors.card}]}>
      {/* 순위 뱃지 */}
      <CircleSkeleton size={28} style={styles.rankBadge} />
      {/* 썸네일 */}
      <Skeleton width={48} height={48} borderRadius={12} style={styles.avatar} />
      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        <Skeleton width="70%" height={16} borderRadius={4} />
        <Skeleton width="50%" height={13} borderRadius={4} style={styles.description} />
      </View>
      {/* 통계 영역 */}
      <View style={styles.statsContainer}>
        <Skeleton width={40} height={14} borderRadius={4} />
        <Skeleton width={30} height={14} borderRadius={4} style={styles.score} />
      </View>
    </View>
  );
};

// 전체 랭킹 스켈레톤
export const RankingSkeleton: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, {color: colors.text}]}>랭킹</Text>
      </View>

      {/* Top 3 영역 */}
      <View style={styles.topCircleRow}>
        <TopCircleSkeleton position="left" />
        <TopCircleSkeleton position="center" />
        <TopCircleSkeleton position="right" />
      </View>

      {/* 리스트 영역 */}
      <View style={styles.listContainer}>
        {[1, 2, 3, 4, 5].map(i => (
          <ListItemSkeleton key={i} />
        ))}
      </View>
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
    marginBottom: 15,
  },
  topCircleCenter: {
    marginBottom: 30,
  },
  topCircleRight: {
    marginBottom: 15,
  },
  badgeContainer: {
    position: 'absolute',
    top: -14,
    left: 32,
    zIndex: 2,
  },
  profileImage: {
    marginBottom: 4,
  },
  title: {
    marginTop: 6,
  },
  listContainer: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  rankBadge: {
    marginRight: 8,
  },
  avatar: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    gap: 6,
  },
  description: {
    marginTop: 4,
  },
  statsContainer: {
    alignItems: 'flex-end',
    gap: 6,
  },
  score: {
    marginTop: 4,
  },
});
