import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 
import { setUser } from '../store/UserSlice'; 
import { toggleTheme } from '../store/themeSlice';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { colors, themePalette } from '../theme/colors'; 
import { auth, db } from '../services/firebase';
import { errorMessageValidation } from '../utils/errorHandling';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.theme.mode);
  const themeColors = themePalette[themeMode];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateFormat = () => {
    let valid = true;
    const tempErrors: any = {};
    const emailRegex = /\S+@\S+\.\S+/;
    
    if (!emailRegex.test(email)) {
      tempErrors.email = 'Formato de correo inválido';
      valid = false;
    }
    if (password.length < 1) {
      tempErrors.password = 'Ingresa tu contraseña';
      valid = false;
    }
    setErrors(tempErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateFormat()) return;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let userName = 'Usuario';
        if (userDocSnap.exists()) {
        userName = userDocSnap.data().name;
      }
        dispatch(setUser({ name: userName, email: email }));
        navigation.replace('Main');
        
      } catch (error: any) {
      errorMessageValidation(error, "Error de Inicio de Sesión");
    }
  };

  const handleGuest = () => {
    dispatch(setUser({ 
      name: 'Visitante', 
      email: 'invitado@cine.com' 
    }));
    
    Alert.alert('Modo Invitado', 'Bienvenido. Algunas funciones pueden estar limitadas.', [
      { text: 'Entendido', onPress: () => navigation.replace('Main') }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Image
        source={require('../../assets/logo_app.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: themeColors.primary }]}>Cinema Pro</Text>

      <CustomInput
        label="Correo Electrónico"
        placeholder="usuario@cine.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <CustomInput
        label="Contraseña"
        placeholder="******"
        value={password}
        onChangeText={setPassword}
        isPassword={true}
        error={errors.password}
      />
    
      <CustomButton 
        title="Iniciar Sesión" 
        onPress={handleLogin} 
      />

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>O</Text>
        <View style={styles.line} />
      </View>

      <CustomButton 
        title="Continuar como Invitado" 
        variant="secondary" 
        onPress={handleGuest} 
      />

      <TouchableOpacity 
        style={styles.registerLink} 
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.footerText}>
          ¿No tienes cuenta? <Text style={[styles.linkText, { color: themeColors.secondary }]}>Regístrate aquí</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => dispatch(toggleTheme())} style={{marginTop: 20}}>
          <Text style={{color: themeColors.text}}>
              Cambiar a modo {themeMode === 'dark' ? 'Claro' : 'Oscuro'}
           </Text>
        </TouchableOpacity>

      <Text style={styles.hintText}>
        (Demo: usuario@cine.com / password123)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, 
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: colors.primary, 
    fontWeight: 'bold',
    marginBottom: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  orText: {
    color: colors.textDim,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  registerLink: {
    marginTop: 20,
  },
  footerText: {
    color: colors.textDim,
    fontSize: 15,
  },
  linkText: {
    color: colors.secondary, 
    fontWeight: 'bold',
  },
  hintText: {
    position: 'absolute',
    bottom: 10,
    color: '#333',
    fontSize: 10
  }
});

export default LoginScreen;