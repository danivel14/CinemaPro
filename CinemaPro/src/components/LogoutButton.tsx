import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { logout } from '../store/UserSlice';
import { colors } from '../theme/colors';

export const LogoutButton = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: () => {
            dispatch(logout());

            // Resetea/Borra el historial para que no puedan volver atrás
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }], // Regresa a Login
              })
            );
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleLogout}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1286/1286853.png' }} 
        style={styles.icon}
      />
      <Text style={styles.text}>Salir</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444'
  },
  icon: {
    width: 8,
    height: 16,
    tintColor: colors.error, // Rojo para acción de salida
    marginRight: 16
  },
  text: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold'
  }
});