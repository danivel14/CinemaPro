import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const MOVIES = [
  { id: '1', title: 'Avatar', genre: 'Sci-Fi', vip: true },
  { id: '2', title: 'Wicked For Good', genre: 'Drama', vip: false },
  { id: '3', title: 'Black Phone 2', genre: 'Horror', vip: true },
];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movieId: item.id, title: item.title })}
    >
      <View style={styles.posterPlaceholder} />
      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieGenre}>{item.genre}</Text>
        {/* Estilo condicional para etiqueta VIP */}
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
      <Text style={styles.subTitle}>Recomendado para ti</Text>
      
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
  headerTitle: { color: colors.text, fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { color: colors.secondary, fontSize: 18, marginBottom: 20 },
  listContent: { paddingBottom: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    height: 120,
  },
  posterPlaceholder: { width: 80, backgroundColor: '#333' },
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