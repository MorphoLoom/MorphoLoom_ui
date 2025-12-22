import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Skeleton} from '../Skeleton';
import {useTheme} from '../../context';

// SocialDetailScreen용 스켈레톤
export const DetailSkeleton: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Skeleton width={28} height={28} borderRadius={4} />
        <Skeleton width={150} height={20} borderRadius={4} />
        <View style={styles.headerRightSpace} />
      </View>

      {/* 비디오 영역 */}
      <Skeleton width="100%" height={400} borderRadius={0} />

      {/* 정보 영역 */}
      <View style={styles.infoContainer}>
        <View style={styles.metaInfo}>
          <Skeleton width={100} height={18} borderRadius={4} />
          <View style={styles.likeContainer}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={30} height={16} borderRadius={4} />
          </View>
        </View>
        <Skeleton width="100%" height={16} borderRadius={4} style={styles.descLine} />
        <Skeleton width="80%" height={16} borderRadius={4} style={styles.descLine} />
        <Skeleton width="60%" height={16} borderRadius={4} />
      </View>
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
  },
  headerRightSpace: {
    width: 28,
  },
  infoContainer: {
    padding: 20,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  descLine: {
    marginBottom: 8,
  },
});
