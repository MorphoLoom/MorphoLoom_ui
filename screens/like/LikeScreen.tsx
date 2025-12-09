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

const mockData = [
  {
    id: '1',
    title: 'Like Title',
    description: 'Description',
    time: '9:41 AM',
    image: 'https://via.placeholder.com/48',
  },
  {
    id: '2',
    title: 'Like Title',
    description: 'Description',
    time: '9:41 AM',
    image: 'https://via.placeholder.com/48',
  },
  {
    id: '3',
    title: 'Like Title',
    description: 'Description',
    time: '9:41 AM',
    image: 'https://via.placeholder.com/48',
  },
  {
    id: '4',
    title: 'Like Title',
    description: 'Description',
    time: '9:41 AM',
    image: 'https://via.placeholder.com/48',
  },
];

const LikeScreen: React.FC = () => {
  const {colors} = useTheme();
  const [isCardView, setIsCardView] = useState(true);

  const renderItem = ({item}) =>
    isCardView ? (
      <View style={styles.cardGrid}>
        <Image source={{uri: item.image}} style={styles.cardImage} />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
    ) : (
      <View style={styles.listItem}>
        <Image source={{uri: item.image}} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: 12,
      }}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Like</Text>
        <TouchableOpacity
          style={styles.toggleBtn}
          onPress={() => setIsCardView(v => !v)}>
          <Ionicons
            name={isCardView ? 'list-outline' : 'grid-outline'}
            size={26}
            color="#888"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingVertical: 8,
          paddingHorizontal: isCardView ? 12 : 0,
        }}
        numColumns={isCardView ? 2 : 1}
        columnWrapperStyle={isCardView ? styles.gridRow : undefined}
        key={isCardView ? 'grid' : 'list'}
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
  toggleBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
  },
  cardGrid: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    padding: 12,
    margin: 6,
    minWidth: '48%',
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#E0E0E0',
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#222',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
  gridRow: {
    justifyContent: 'space-between',
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
