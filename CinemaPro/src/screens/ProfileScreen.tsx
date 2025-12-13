import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/themeSlice';
import { themePalette } from '../theme/colors';
import { LogoutButton } from '../components/LogoutButton'; 

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector(state => state.theme);
  const colors = themePalette[mode];
  const user = useAppSelector(state => state.user);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Mi Perfil</Text>
      
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textDim }]}>Nombre</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user.name || 'Invitado'}</Text>
        
        <Text style={[styles.label, { color: colors.textDim, marginTop: 10 }]}>Email</Text>
        <Text style={[styles.value, { color: colors.text }]}>{user.email || 'N/A'}</Text>
      </View>

      <TouchableOpacity 
        style={[styles.optionBtn, { borderColor: colors.border }]} 
        onPress={() => dispatch(toggleTheme())}
      >
        <Text style={{ color: colors.text }}>
          Tema: {mode === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <LogoutButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  card: { padding: 20, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 12 },
  value: { fontSize: 16, fontWeight: 'bold' },
  optionBtn: { padding: 15, borderRadius: 8, borderWidth: 1, alignItems: 'center', marginBottom: 10 }
});