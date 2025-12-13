import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { themePalette } from '../theme/colors';
import { useAppSelector } from '../store/hooks';

export const TicketsScreen = () => {
  const { mode } = useAppSelector(state => state.theme);
  const themeColors = themePalette[mode];
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchTickets = async () => {
        const user = auth.currentUser;
        if (!user) { setLoading(false); return; }
        try {
          const q = query(collection(db, "orders"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const loadedTickets: any[] = [];
          querySnapshot.forEach((doc) => {
            loadedTickets.push({ id: doc.id, ...doc.data() });
          });
          loadedTickets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setTickets(loadedTickets);
        } catch (error) { console.log(error); } finally { setLoading(false); }
      };
      fetchTickets();
    }, [])
  );

  const renderTicket = ({ item }: any) => (
    <View style={[styles.ticketCard, { backgroundColor: themeColors.surface }]}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={[styles.movieTitle, { color: themeColors.text }]}>{item.movieTitle}</Text>
        <Text style={{ color: themeColors.textDim }}>{item.hall}</Text>
        <Text style={{ color: themeColors.textDim }}>{new Date(item.date).toLocaleDateString()} - {item.showtime} hrs</Text>
        <Text style={{ color: themeColors.secondary, fontWeight: 'bold' }}>Total: ${item.totalPaid}</Text>
      </View>
      <Image source={{ uri: item.qrUrl }} style={{ width: 80, height: 80, borderRadius: 4 }} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.headerTitle, { color: themeColors.text }]}>Mis Entradas</Text>
      {loading ? <ActivityIndicator color={themeColors.primary} /> : 
       <FlatList data={tickets} renderItem={renderTicket} keyExtractor={item => item.id} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  ticketCard: { flexDirection: 'row', borderRadius: 12, marginBottom: 15, padding: 15 },
  movieTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});