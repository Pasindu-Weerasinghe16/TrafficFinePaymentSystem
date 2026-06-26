import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SearchScreen from './driver_views/SearchScreen';
import PaymentScreen from './driver_views/PaymentScreen';
import SuccessScreen from './driver_views/SuccessScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Search"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0056b3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Search" 
            component={SearchScreen} 
            options={{ title: 'Fine Payment' }} 
          />
          <Stack.Screen 
            name="Payment" 
            component={PaymentScreen} 
            options={{ title: 'Pay Fine' }} 
          />
          <Stack.Screen 
            name="Success" 
            component={SuccessScreen} 
            options={{ title: 'Payment Success', headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
