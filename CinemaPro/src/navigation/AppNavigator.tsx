import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import { SnacksScreen } from '../screens/SnacksScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';

// 👉 IMPORTA LA NUEVA PANTALLA
import { PreferencesScreen } from '../screens/PreferencesScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="Main" component={HomeScreen} />

        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Snacks" component={SnacksScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />

        <Stack.Screen name="Preferences" component={PreferencesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
