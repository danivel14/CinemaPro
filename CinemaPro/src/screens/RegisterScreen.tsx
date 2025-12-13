import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/UserSlice';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { colors } from '../theme/colors';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase'; 
import { errorMessageValidation } from '../utils/errorHandling';

export const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    let valid = true;
    const tempErrors: any = {};

    if (!name.trim()) { 
      tempErrors.name = 'El nombre es obligatorio'; 
      valid = false; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { 
      tempErrors.email = 'Ingresa un correo electrónico válido'; 
      valid = false; 
    }

    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(phone)) { 
      tempErrors.phone = 'Teléfono inválido (mínimo 8 dígitos)'; 
      valid = false; 
    }

    if (password.length < 6) { 
      tempErrors.password = 'La contraseña debe tener al menos 6 caracteres'; 
      valid = false; 
    }

    if (password !== confirmPassword) { 
      tempErrors.confirmPassword = 'Las contraseñas no coinciden'; 
      valid = false; 
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) {
      Alert.alert('Error', 'Corrige los campos marcados');
      return;
    }

    try {
      // usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // documento en la colección 'users' con el ID del usuario
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        phone: phone,
        createdAt: new Date()
      });

      dispatch(setUser({
        name: name,
        email: email
      }));

      Alert.alert('¡Bienvenido!', 'Cuenta creada exitosamente en la nube.', [
        { text: 'Continuar', onPress: () => navigation.replace('Main') }
      ]);

    } catch (error: any) {
      errorMessageValidation(error, "No se pudo crear la cuenta");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete para disfrutar las mejores películas</Text>
          
          <CustomInput 
            label="Nombre Completo" 
            placeholder="Ej. Juan Pérez"
            value={name} 
            onChangeText={setName} 
            error={errors.name} 
            autoCapitalize="words"
          />

          <CustomInput 
            label="Correo Electrónico" 
            placeholder="ejemplo@correo.com"
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            error={errors.email} 
          />

          <CustomInput 
            label="Teléfono" 
            placeholder="99999999"
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="numeric" 
            error={errors.phone}
          />

          <CustomInput 
            label="Contraseña" 
            placeholder="******"
            value={password} 
            onChangeText={setPassword} 
            isPassword={true} 
            error={errors.password} 
          />

          <CustomInput 
            label="Confirmar Contraseña" 
            placeholder="******"
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            isPassword={true} 
            error={errors.confirmPassword} 
          />

          <View style={styles.buttonContainer}>
            <CustomButton title="Registrarse" onPress={handleRegister} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.loginLink}>
            <Text style={styles.textDim}>
              ¿Ya tienes cuenta? <Text style={styles.textHighlight}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  scrollContent: { 
    padding: 20, 
    paddingTop: 40,
    paddingBottom: 40
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: colors.primary, 
    textAlign: 'center',
    marginBottom: 5 
  },
  subtitle: {
    fontSize: 16,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 30
  },
  buttonContainer: {
    marginTop: 10
  },
  loginLink: {
    marginTop: 25, 
    alignItems: 'center',
    padding: 10
  },
  textDim: {
    color: colors.textDim,
    fontSize: 15
  },
  textHighlight: {
    color: colors.secondary,
    fontWeight: 'bold'
  }
});