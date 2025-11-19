import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

const App = () => {
  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={colors.background} 
      />
      <AppNavigator />
    </>
  );
};

export default App;