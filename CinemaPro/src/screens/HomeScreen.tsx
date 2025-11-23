import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAppSelector } from '../store/hooks';

const MOVIES = [
  { 
    id: '1', title: 'Frankenstein', genre: 'Sci-Fi', vip: true, 
    poster: 'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2025/08/31180656/frankenstein-2025-poster.jpg'
  },
  { 
    id: '2', title: 'Wicked: For Good', genre: 'Drama', vip: false,
    poster: 'https://cdn.cinematerial.com/p/297x/vnc0anwp/wicked-for-good-movie-poster-md.jpg?v=1761059702'
  },
  { 
    id: '3', title: 'Now You See Me 3', genre: 'Crime', vip: true,
    poster: 'https://m.media-amazon.com/images/M/MV5BYmZmZDc1Y2EtMmU2MS00NmMzLTllZmYtNjlkODFkNjZlOGE0XkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg'
  },
];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { name } = useAppSelector(state => state.user);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Details', { 
           movieId: item.id, 
           title: item.title,
           poster: item.poster,
           genre: item.genre   
    })}
    >
      <Image 
        source={{ uri: item.poster }} 
        style={styles.posterImage} 
        resizeMode="cover"
      />

      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieGenre}>{item.genre}</Text>
        
        {item.vip && (
          <View style={styles.vipTag}>
            <Text style={styles.vipText}>VIP Disponible</Text>
          </View>
        )}
        
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cartelera</Text>
      
      {/* el nombre atraído de Redux */}
      <Text style={styles.welcomeText}>
        Bienvenido, {name || 'Invitado'}
      </Text>
      
      <FlatList
        data={MOVIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50, 
    paddingHorizontal: 20,
  },
  headerTitle: { 
    color: colors.text, 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  welcomeText: { 
    color: colors.secondary, 
    color: colors.secondary, // color secundario para resaltar el nombre
    fontSize: 18, 
    marginBottom: 20 
  },
  listContent: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    height: 140, 
  },
  posterImage: { 
    width: 100, 
    height: '100%' 
  },
  infoContainer: { flex: 1, padding: 15, justifyContent: 'center' },
  movieTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  movieGenre: { color: colors.textDim, marginTop: 5 },
  vipTag: {
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 10,
  },
  vipText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
});