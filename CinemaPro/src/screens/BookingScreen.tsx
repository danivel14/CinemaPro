import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAppDispatch } from '../store/hooks';
import { setBookingDetails } from '../store/bookingSlice';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../theme/colors';
import { errorMessageValidation } from '../utils/errorHandling';

const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const SHOWTIMES = ['14:00', '16:30', '19:00', '21:30', '23:00'];

// grid vacío de 4 filas x 6 columnas
const INITIAL_GRID = Array(4).fill(null).map(() => Array(6).fill(0));

export const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { movieTitle } = route.params || { movieTitle: 'Película' };
  const dispatch = useAppDispatch();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [loadingSeats, setLoadingSeats] = useState(false);
  
  // Lista de asientos ocupados traída de Firebase
  const [occupiedFromDB, setOccupiedFromDB] = useState<string[]>([]);
  
  // Lista de asientos que el usuario está seleccionando en el momento
  const [mySelectedSeats, setMySelectedSeats] = useState<string[]>([]);

  const PRICE_STANDARD = 8.50;
  const PRICE_VIP = 15.00;
  const currentPrice = isVip ? PRICE_VIP : PRICE_STANDARD;

  // --- carga asientos al cambiar horario ---
  useEffect(() => {
    if (!selectedTime) return;

    const fetchOccupiedSeats = async () => {
      setLoadingSeats(true);
      setMySelectedSeats([]); // Limpiar mi selección al cambiar hora
      
      try {
        // ID Único para el documento: "Pelicula_Horario" 
        const docID = `${movieTitle.replace(/\s+/g, '_')}_${selectedTime}`;
        
        const docRef = doc(db, "showtimes", docID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Si ya hay reservas, guardamos los asientos ocupados en el estado
          setOccupiedFromDB(docSnap.data().occupied || []);
        } else {
          // Si no existe el documento, significa que la sala está vacía
          setOccupiedFromDB([]);
        }
      } catch (error) {
         errorMessageValidation(error, "Error de Reserva");
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchOccupiedSeats();
  }, [selectedTime, movieTitle]);

  // --- SELECCIÓN ---
  const toggleSeat = (rowIndex: number, colIndex: number) => {
    if (!selectedTime) {
      Alert.alert('Atención', 'Primero selecciona un horario.');
      return;
    }

    const seatName = `${ROW_LETTERS[rowIndex]}${colIndex + 1}`;

    // Si ya está ocupado en la base de datos, no hacemos nada
    if (occupiedFromDB.includes(seatName)) return;

    // Si ya lo seleccioné yo, lo quito. Si no, lo agrego.
    if (mySelectedSeats.includes(seatName)) {
      setMySelectedSeats(mySelectedSeats.filter(s => s !== seatName));
    } else {
      setMySelectedSeats([...mySelectedSeats, seatName]);
    }
  };

  // --- ESTADO VISUAL DE UN ASIENTO ---
  const getSeatStatus = (rowIndex: number, colIndex: number) => {
    const seatName = `${ROW_LETTERS[rowIndex]}${colIndex + 1}`;
    
    if (occupiedFromDB.includes(seatName)) return 1; // Ocupado (Rojo/Gris)
    if (mySelectedSeats.includes(seatName)) return 2; // Seleccionado por mí (Verde/Naranja)
    return 0; // Libre
  };

  const handleContinue = async () => {
    if (!selectedTime) {
      Alert.alert('Falta información', 'Selecciona un horario.');
      return;
    }
    if (mySelectedSeats.length === 0) {
      Alert.alert('Falta información', 'Selecciona al menos un asiento.');
      return;
    }

    // guarda la reserva en Firebase
    try {
      const docID = `${movieTitle.replace(/\s+/g, '_')}_${selectedTime}`;
      const docRef = doc(db, "showtimes", docID);
      // arrayUnion agrega los asientos sin borrar los que ya estaban.
      await setDoc(docRef, {
        occupied: arrayUnion(...mySelectedSeats)
      }, { merge: true });

    } catch (error) {
      errorMessageValidation(error, "Error de Reserva");
    }

    // GUARDA EN REDUX
    dispatch(setBookingDetails({
      movieTitle: movieTitle,
      selectedSeats: mySelectedSeats,
      showtime: selectedTime,
      experience: isVip ? 'VIP' : 'Standard',
      ticketPrice: currentPrice,
      hall: isVip ? 'Sala VIP' : 'Sala General'
    }));

    navigation.navigate('Snacks');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.title}>Reserva tu entrada</Text>
        <Text style={styles.movieTitleHeader}>{movieTitle}</Text>

        {/* --- VIP TOGGLE --- */}
        <View style={styles.vipContainer}>
          <Text style={styles.sectionLabel}>Experiencia:</Text>
          <View style={styles.switchContainer}>
            <TouchableOpacity 
              style={[styles.switchBtn, !isVip && styles.switchBtnActive]} 
              onPress={() => setIsVip(false)}
            >
              <Text style={[styles.switchText, !isVip && styles.switchTextActive]}>Standard (${PRICE_STANDARD})</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.switchBtn, isVip && styles.switchBtnActiveVIP]} 
              onPress={() => setIsVip(true)}
            >
              <Text style={[styles.switchText, isVip && styles.switchTextActive]}>VIP (${PRICE_VIP})</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- HORARIOS --- */}
        <View style={styles.timeSection}>
          <Text style={styles.sectionLabel}>Horario:</Text>
          <FlatList 
            horizontal
            data={SHOWTIMES}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.timeChip, 
                  selectedTime === item && (isVip ? styles.timeChipSelectedVIP : styles.timeChipSelected)
                ]}
                onPress={() => setSelectedTime(item)}
              >
                <Text style={[
                  styles.timeText, 
                  selectedTime === item && { color: 'black', fontWeight: 'bold' }
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* --- MAPA DE ASIENTOS --- */}
        {loadingSeats ? (
          <View style={{ height: 200, justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{color: 'white', textAlign: 'center', marginTop: 10}}>Verificando disponibilidad...</Text>
          </View>
        ) : (
          <>
            <View style={styles.screenContainer}>
              <View style={[styles.screenLine, isVip && { backgroundColor: colors.secondary }]} />
              <Text style={styles.screenText}>PANTALLA {isVip ? 'VIP' : ''}</Text>
            </View>

            <View style={styles.gridContainer}>
              {INITIAL_GRID.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.rowContainer}>
                  <Text style={styles.rowLabel}>{ROW_LETTERS[rowIndex]}</Text>
                  <View style={styles.seatsRow}>
                    {row.map((_, colIndex) => {
                      // Calculamos el estado dinámicamente
                      const status = getSeatStatus(rowIndex, colIndex); 
                      
                      return (
                        <TouchableOpacity
                          key={`${rowIndex}-${colIndex}`}
                          onPress={() => toggleSeat(rowIndex, colIndex)}
                          style={[
                            styles.seat,
                            status === 1 && styles.seatOccupied,
                            status === 2 && (isVip ? styles.seatSelectedVIP : styles.seatSelected),
                          ]}
                          disabled={status === 1} // Deshabilitar si está ocupado por otro
                        />
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}><View style={styles.seat}/><Text style={styles.legendText}>Libre</Text></View>
          <View style={styles.legendItem}>
            <View style={[styles.seat, isVip ? styles.seatSelectedVIP : styles.seatSelected]}/>
            <Text style={styles.legendText}>Tu Selección</Text>
          </View>
          <View style={styles.legendItem}><View style={[styles.seat, styles.seatOccupied]}/><Text style={styles.legendText}>Ocupado</Text></View>
        </View>

      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Boletos:</Text>
          <Text style={[styles.priceValue, isVip && { color: colors.secondary }]}>
            ${(mySelectedSeats.length * currentPrice).toFixed(2)}
          </Text>
        </View>
        <CustomButton 
          title="Continuar" 
          onPress={handleContinue}
          variant={isVip ? 'secondary' : 'primary'}
          // Deshabilitamos si no hay hora o asientos
          loading={loadingSeats}
        />
      </View>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 120 },
  
  title: { color: colors.textDim, fontSize: 16, textAlign: 'center' },
  movieTitleHeader: { color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

  vipContainer: { marginBottom: 20 },
  switchContainer: { flexDirection: 'row', backgroundColor: '#333', borderRadius: 8, padding: 4 },
  switchBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  switchBtnActive: { backgroundColor: colors.primary },
  switchBtnActiveVIP: { backgroundColor: colors.secondary },
  switchText: { color: '#aaa', fontWeight: 'bold' },
  switchTextActive: { color: 'white' },

  timeSection: { marginBottom: 30 },
  sectionLabel: { color: 'white', marginBottom: 5, fontWeight: 'bold' },
  timeChip: { 
    paddingHorizontal: 20, paddingVertical: 10, 
    borderRadius: 20, borderWidth: 1, borderColor: '#555', 
    backgroundColor: colors.surface 
  },
  timeChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipSelectedVIP: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  timeText: { color: 'white' },

  screenContainer: { alignItems: 'center', marginBottom: 20 },
  screenLine: { width: '80%', height: 4, backgroundColor: colors.primary, borderRadius: 10, marginBottom: 5, shadowColor: colors.primary, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  screenText: { color: colors.textDim, fontSize: 10, letterSpacing: 2 },

  gridContainer: { alignItems: 'center', marginBottom: 20 },
  rowContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rowLabel: { color: colors.textDim, width: 20, marginRight: 10, fontWeight: 'bold' },
  seatsRow: { flexDirection: 'row', gap: 6 },
  
  seat: { width: 30, height: 30, backgroundColor: '#3A3A3A', borderRadius: 6 },
  
  // Estilo OCUPADO: Ahora es gris oscuro con borde rojo sutil para indicar "no disponible"
  seatOccupied: { backgroundColor: '#555', opacity: 0.5, borderWidth: 1, borderColor: '#666' },
  
  seatSelected: { backgroundColor: colors.primary },
  seatSelectedVIP: { backgroundColor: colors.secondary },

  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendText: { color: colors.textDim, fontSize: 12 },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: '#333', flexDirection: 'column' },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  priceLabel: { color: 'white', fontSize: 16 },
  priceValue: { color: 'white', fontSize: 20, fontWeight: 'bold' }
});