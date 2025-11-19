import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { colors } from '../theme/colors';
import { Text, View } from 'react-native';

// Stacks y Tabs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para pantallas no implementadas completamente
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{flex:1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center'}}>
    <Text style={{color: 'white'}}>Pantalla: {name}</Text>
  </View>
);

// Navegación de Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: 'transparent' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" children={() => <PlaceholderScreen name="Perfil" />} />
    </Tab.Navigator>
  );
}

// Navegación Principal 
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        
        {/* Pantallas dentro del flujo de compra (Sin tabs) */}
        <Stack.Screen 
          name="Details" 
          children={(props: any) => (
            // inline para simular detalle y botón de reservar
            <View style={{flex:1, backgroundColor: colors.background, justifyContent:'center', alignItems:'center'}}>
               <Text style={{color:'white', fontSize:24, marginBottom:20}}>{props.route.params.title}</Text>
               <Text style={{color:'#aaa', padding:20, textAlign:'center'}}>Sinopsis: Una película que no te queras perder.</Text>
               <View style={{width:'80%'}}>
                 <CustomButton title="Reservar Asientos" onPress={() => props.navigation.navigate('Booking', { movieTitle: props.route.params.title })} />
               </View>
            </View>
          )} 
        />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Snacks" children={() => <PlaceholderScreen name="Selección de Snacks" />} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { CustomButton } from '../components/CustomButton';