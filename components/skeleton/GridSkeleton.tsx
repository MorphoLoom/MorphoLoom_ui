import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {Skeleton} from '../Skeleton';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

interface GridSkeletonProps {
  itemCount?: number;
}

// 3열 그리드 스켈레톤 (SocialScreen, LikedCreationsScreen용)
export const GridSkeleton: React.FC<GridSkeletonProps> = ({itemCount = 12}) => {
  const rows = Math.ceil(itemCount / 3);

  return (
    <View style={styles.container}>
      {Array.from({length: rows}).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {Array.from({length: 3}).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            if (index >= itemCount) return null;
            return (
              <View key={colIndex} style={styles.gridItem}>
                <Skeleton
                  width={ITEM_WIDTH}
                  height={ITEM_WIDTH}
                  borderRadius={0}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
  },
});
