import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearBooking } from '../store/bookingSlice';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../theme/colors';

export const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { snacksTotal, snackList } = route.params || {};
  const user = useAppSelector(state => state.user);
  const booking = useAppSelector(state => state.booking);
  const numberOfTickets = booking.selectedSeats.length;
  const ticketSubtotal = booking.ticketPrice * numberOfTickets;
  
  const snacksCost = parseFloat(snacksTotal || '0');
  
  const grandTotal = (ticketSubtotal + snacksCost).toFixed(2);

  // CÓDIGO QR
  const reservationData = JSON.stringify({
    u: user.name,
    m: booking.movieTitle,
    h: booking.hall,
    s: booking.selectedSeats,
    t: `$${grandTotal}`
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reservationData)}`;

  const handleFinish = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        await addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          movieTitle: booking.movieTitle,
          hall: booking.hall,
          showtime: booking.showtime,
          seats: booking.selectedSeats,
          snacks: snackList || [],
          totalPaid: grandTotal,
          qrUrl: qrUrl,
          date: new Date().toISOString() 
        });
      }

      dispatch(clearBooking());
      
      Alert.alert('¡Gracias!', 'Tu boleto ha sido guardado en "Mis Entradas".', [
        { text: 'Volver al Inicio', onPress: () => navigation.navigate('Main') }
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Se generó el ticket pero no se pudo guardar en el historial.");
      dispatch(clearBooking());
      navigation.navigate('Main');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.headerTitle}>Tu Ticket Digital</Text>
        <Text style={styles.subtitle}>Presenta este código en taquilla</Text>

        <View style={styles.ticketCard}>
          
          <View style={styles.ticketHeader}>
            <Text style={styles.movieTitle}>{booking.movieTitle}</Text>
            <Text style={styles.cinemaName}>Cinema Pro - {booking.hall}</Text>
          </View>

          <View style={styles.qrContainer}>
            <Image source={{ uri: qrUrl }} style={styles.qrImage} />
            <Text style={styles.qrLabel}>Total: ${grandTotal}</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{user.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Función:</Text>
              <Text style={styles.value}>{booking.showtime} hrs</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Sala:</Text>
              {/* Mostramos si es VIP o Estándar */}
              <Text style={[styles.value, booking.experience === 'VIP' && {color: colors.secondary}]}>
                {booking.experience}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Asientos ({numberOfTickets}):</Text>
              <Text style={styles.value}>{booking.selectedSeats.join(', ')}</Text>
            </View>
            
            {snackList && snackList.length > 0 && (
              <View style={styles.snacksSection}>
                <Text style={styles.label}>Snacks:</Text>
                {snackList.map((item: string, index: number) => (
                  <Text key={index} style={styles.snackItem}>• {item}</Text>
                ))}
              </View>
            )}
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.totalContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>Boletos ({booking.experience}):</Text>
              <Text style={styles.value}>${ticketSubtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Snacks:</Text>
              <Text style={styles.value}>${snacksCost.toFixed(2)}</Text>
            </View>
            <View style={[styles.row, { marginTop: 10 }]}>
              <Text style={styles.totalLabel}>TOTAL PAGADO:</Text>
              <Text style={styles.totalValue}>${grandTotal}</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton 
          title="Finalizar y Guardar" 
          onPress={handleFinish} 
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginTop: 20 },
  subtitle: { fontSize: 16, color: colors.textDim, textAlign: 'center', marginBottom: 30 },
  
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
  },
  ticketHeader: {
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: 'center',
  },
  movieTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  cinemaName: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  
  qrContainer: { padding: 30, alignItems: 'center', backgroundColor: 'white' },
  qrImage: { width: 180, height: 180 },
  qrLabel: { color: '#333', marginTop: 10, fontSize: 16, fontWeight: 'bold' },

  dashedLine: {
    height: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 1,
  },

  detailsContainer: { padding: 20 },
  snacksSection: { marginTop: 10 },
  snackItem: { color: '#555', fontSize: 14, marginLeft: 10 },

  totalContainer: { padding: 20, backgroundColor: '#f9f9f9' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { color: '#666', fontSize: 14 },
  value: { color: '#000', fontSize: 14, fontWeight: '600' },
  
  totalLabel: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  totalValue: { color: colors.secondary, fontSize: 20, fontWeight: 'bold' },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20 },
});