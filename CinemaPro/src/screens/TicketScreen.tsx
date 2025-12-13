import React from 'react';
import { View, Text } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { themePalette } from '../theme/colors';

export const TicketsScreen = () => {
  const { mode } = useAppSelector(state => state.theme);
  const colors = themePalette[mode];

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <Text style={{ color: colors.textDim, fontSize: 18 }}>Aquí aparecerán tus tickets</Text>
    </View>
  );
};