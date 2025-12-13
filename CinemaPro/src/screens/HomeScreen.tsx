import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useAppSelector } from '../store/hooks';
import { LogoutButton } from '../components/LogoutButton';
import { loadPreferences } from '../services/preferencesService';

const MOVIES = [
  { id: '1', title: 'Frankenstein', genre: 'Sci-Fi', vip: true,
    poster: 'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2025/08/31180656/frankenstein-2025-poster.jpg',
    synopsis: "...", hall: 'Sala 3', duration: '2h 30min' },

  { id: '2', title: 'Wicked: For Good', genre: 'Drama', vip: false,
    poster: 'https://cdn.cinematerial.com/p/297x/vnc0anwp/wicked-for-good-movie-poster-md.jpg?v=1761059702',
    synopsis: "...", hall: 'Sala 2', duration: '2h 17min' },

  { id: '3', title: 'Now You See Me 3', genre: 'Action', vip: true,
    poster: 'https://m.media-amazon.com/images/M/MV5BYmZmZDc1Y2EtMmU2MS00NmMzLTllZmYtNjlkODFkNjZlOGE0XkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg',
    synopsis: "...", hall: 'Sala 1', duration: '1h 53min' },
];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { name, email } = useAppSelector(state => state.user);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const prefs = await loadPreferences(email);
      setPreferences(prefs);

      const filtered = MOVIES.filter(m => prefs.includes(m.genre));
      setSuggestions(filtered);
    };

    load();
  }, []);

  const goToDetails = (item: any) => {
    navigation.navigate('Details', { ...item });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => goToDetails(item)}>
      <Image source={{ uri: item.poster }} style={styles.posterImage} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieGenre}>{item.genre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cartelera</Text>
      <Text style={styles.welcomeText}>Bienvenido, {name || 'Invitado'}</Text>

      <LogoutButton />

      {/* 🔥 BOTÓN PARA IR A SNACKS */}
      <TouchableOpacity
        style={styles.snacksButton}
        onPress={() => navigation.navigate('Snacks')}
      >
        <Text style={styles.snacksButtonText}>Comprar Snacks</Text>
      </TouchableOpacity>

      {/* SECCIÓN DE SUGERENCIAS */}
      <Text style={styles.sectionTitle}>Sugerencias para ti</Text>

      {preferences.length === 0 ? (
        <Text style={styles.noPreferences}>
          No has añadido gustos. Ve a “Preferencias” para añadir tus géneros favoritos.
        </Text>
      ) : suggestions.length === 0 ? (
        <Text style={styles.noPreferences}>
          No hay películas que coincidan con tus gustos hoy.
        </Text>
      ) : (
        <FlatList
          data={suggestions}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}

      <Text style={styles.sectionTitle}>Todas las películas</Text>

      <FlatList
        data={MOVIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
    fontWeight: 'bold'
  },
  welcomeText: {
    color: colors.secondary,
    fontSize: 16,
    marginBottom: 20
  },

  // 🔥 ESTILOS DEL BOTÓN DE SNACKS
  snacksButton: {
    backgroundColor: '#ff8900',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 25,
  },
  snacksButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10
  },
  noPreferences: { color: colors.textDim, marginBottom: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    height: 120,
  },
  posterImage: { width: 90, height: '100%' },
  infoContainer: { flex: 1, padding: 15, justifyContent: 'center' },
  movieTitle: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  movieGenre: { color: colors.textDim, marginTop: 5 },
});
