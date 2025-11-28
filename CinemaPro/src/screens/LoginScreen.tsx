import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/UserSlice'; 
import { CustomButton } from '../components/CustomButton';
import { colors } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { signInWithEmailAndPassword } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../services/firebase';


export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

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
      // intento de loguear con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar el nombre del usuario en Firestore (Base de datos)
      // Usamos el UID para encontrar su documento
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let userName = 'Usuario'; // Nombre por defecto si falla la DB
      if (userDocSnap.exists()) {
        userName = userDocSnap.data().name; // Obtenemos el nombre real
      }

      // 3. Actualizar Redux
      dispatch(setUser({ name: userName, email: email }));
      
      // 4. Entrar
      navigation.replace('Main');

    } catch (error: any) {
      console.log(error);
      // Manejo de errores reales
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Correo o contraseña incorrectos.');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Bloqueado', 'Demasiados intentos. Intenta más tarde.');
      } else {
        Alert.alert('Error', 'Falló el inicio de sesión: ' + error.message);
      }
    }
  };

  // para modo invitado
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
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo_app.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Cinema Pro</Text>

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

      {/* BOTÓN PRINCIPAL: LOGIN */}
      <CustomButton 
        title="Iniciar Sesión" 
        onPress={handleLogin} 
      />

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>O</Text>
        <View style={styles.line} />
      </View>

      {/* BOTÓN SECUNDARIO: INVITADO */}
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
          ¿No tienes cuenta? <Text style={styles.linkText}>Regístrate aquí</Text>
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
  
  // Estilos del divisor "--- O ---"
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