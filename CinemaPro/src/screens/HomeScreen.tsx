import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { themePalette } from '../theme/colors';
import { LogoutButton } from '../components/LogoutButton';
import { loadPreferences } from '../services/preferencesService';

const MOVIES = [
  { 
    id: '1', title: 'Frankenstein', genre: 'Sci-Fi', vip: true,
    poster: 'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2025/08/31180656/frankenstein-2025-poster.jpg',
    synopsis: "Basada en la novela de Mary Shelley, se centra en el brillante pero egoísta científico Victor Frankenstein (Oscar Isaac) que, obsesionado con vencer a la muerte, crea una criatura a partir de partes de cadáveres, solo para aborrecerla por su aspecto. La historia sigue el trágico viaje de la Criatura (Jacob Elordi), rechazada por todos y condenada a la soledad, lo que la lleva a buscar venganza contra su creador, explorando temas como la ambición, el abandono, la identidad y la fragilidad humana, en una versión gótica y emocionalmente resonante del clásico. ", 
    hall: 'Sala 4 (IMAX)', 
    duration: '2h 15min' 
  },
  { 
    id: '2', title: 'Wicked: For Good', genre: 'Drama', vip: true,
    poster: 'https://cdn.cinematerial.com/p/297x/vnc0anwp/wicked-for-good-movie-poster-md.jpg?v=1761059702',
    synopsis: "Mientras la fama de Glinda crece y se prepara para casarse con el Príncipe Fiyero en una espectacular boda oziana, ella se ve atormentada por su separación de Elphaba. Intenta mediar una reconciliación entre Elphaba y el Mago, pero esos esfuerzos fracasan, alejando aún más a las dos amigas.",
    hall: 'Sala 2', 
    duration: '2h 45min' 
  },
  { 
    id: '3', title: 'Now You See Me 3', genre: 'Action', vip: true,
    poster: 'https://m.media-amazon.com/images/M/MV5BYmZmZDc1Y2EtMmU2MS00NmMzLTllZmYtNjlkODFkNjZlOGE0XkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg',
    synopsis: "Los Cuatro Jinetes están de regreso… y no vienen solos. Una nueva generación de ilusionistas se une al equipo para llevar la magia al siguiente nivel. Más giros, más trampas, más espectáculo. Nada es lo que parece... y esta vez, menos que nunca.", 
    hall: 'Sala 1', 
    duration: '1h 50min' 
  },
];

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { name, email } = useAppSelector(state => state.user);
  const { mode } = useAppSelector(state => state.theme);
  const colors = themePalette[mode]; // Colores dinámicos

  const [preferences, setPreferences] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const prefs = await loadPreferences(email);
        setPreferences(prefs || []);

        // Filtro de películas
        if (prefs && prefs.length > 0) {
          const filtered = MOVIES.filter(m => prefs.includes(m.genre));
          setSuggestions(filtered);
        } else {
          setSuggestions([]);
        }
      };
      load();
    }, [email])
  );

  const goToDetails = (item: any) => {
    navigation.navigate('Details', { ...item });
  };

  const renderMovieItem = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface }]} 
      onPress={() => goToDetails(item)}
    >
      <Image source={{ uri: item.poster }} style={styles.posterImage} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={[styles.movieTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.movieGenre, { color: colors.textDim }]}>{item.genre}</Text>
        <Text style={{ color: colors.textDim, fontSize: 12, marginTop: 4 }}>⏱ {item.duration}</Text>
        
        {item.vip && (
          <View style={[styles.vipBadge, { backgroundColor: colors.secondary }]}>
            <Text style={styles.vipText}>VIP</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSuggestionItem = ({ item }: any) => (
    <TouchableOpacity style={styles.suggestionCard} onPress={() => goToDetails(item)}>
      <Image source={{ uri: item.poster }} style={styles.suggestionPoster} resizeMode="cover" />
      <Text style={[styles.suggestionTitle, { color: colors.textDim }]} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const MainHeader = () => (
    <View>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Cartelera</Text>
          <Text style={[styles.welcomeText, { color: colors.secondary }]}>
            Hola, {name || 'Invitado'}
          </Text>
        </View>
        <LogoutButton />
      </View>

      <TouchableOpacity
        style={[styles.snacksButton, { borderColor: colors.border }]}
        onPress={() => navigation.navigate('Snacks')}
      >
        <Text style={styles.snacksButtonText}>🍿 Comprar Snacks</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Para ti ❤️</Text>
      
      {preferences.length === 0 ? (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Preferences')} 
          style={[styles.emptyStateBox, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.noPreferencesText, { color: colors.textDim }]}>
            Aún no tienes gustos guardados. {"\n"}
            <Text style={{color: colors.secondary, fontWeight:'bold'}}>
              Toca aquí para personalizar.
            </Text>
          </Text>
        </TouchableOpacity>
      ) : suggestions.length === 0 ? (
        <Text style={[styles.noPreferencesText, { color: colors.textDim, marginBottom: 20 }]}>
          No hay coincidencias en cartelera hoy.
        </Text>
      ) : (
        <FlatList
          horizontal
          data={suggestions}
          renderItem={renderSuggestionItem}
          keyExtractor={item => `sugg-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsList}
        />
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Todas las películas</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={MOVIES}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={MainHeader} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 5
  },
  snacksButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    alignItems: 'center'
  },
  snacksButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10
  },
  suggestionsList: {
    paddingBottom: 20,
    gap: 15,
  },
  suggestionCard: {
    width: 140,
    marginRight: 10,
  },
  suggestionPoster: {
    width: 140,
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  emptyStateBox: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  noPreferencesText: { 
    fontSize: 14, 
    lineHeight: 20
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    height: 130, 
  },
  posterImage: { width: 90, height: '100%' },
  infoContainer: { flex: 1, padding: 15, justifyContent: 'center' },
  movieTitle: { fontSize: 18, fontWeight: 'bold' },
  movieGenre: { marginTop: 4, fontSize: 14 },
  vipBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vipText: { color: 'black', fontWeight: 'bold', fontSize: 10 },
});