import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';
import { themePalette } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { TicketsScreen } from '../screens/TicketScreen';
import { ProfileScreen } from '../screens/ProfileScreen'; 

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const themeMode = useAppSelector(state => state.theme.mode);
  const colors = themePalette[themeMode];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'home';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Tickets') iconName = focused ? 'ticket' : 'ticket-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Tickets" component={TicketsScreen} options={{ title: 'Mis Entradas' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};