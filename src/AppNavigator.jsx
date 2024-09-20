import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text } from 'react-native';
import Main from './Main';
const Stack = createNativeStackNavigator();


const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
