import * as React from 'react';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native'; // Import ActivityIndicator for loading indicator
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Welcome from './app/screens/Welcome';
import Login from './app/screens/Login';
import SignUp from './app/screens/SignUp';
import Home from './app/screens/Home';
import UserBookings from './app/screens/UserBookings';
import PaymentScreen from './app/screens/PaymentScreen';
import VehicleDetails from './app/screens/VehicleDetails';
import BookingDetails from './app/screens/BookingDetails';
import SelectSlot from './app/screens/SelectSlot';
import BookingConfirmation from './app/screens/BookingConfirmation';

function App() {
  const Stack = createNativeStackNavigator();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check login status on app startup
  async function checkLoginStatus() {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(data); // Parse data to boolean
      console.log(data);
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (isLoading) {
    // Show loading indicator while checking login status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn==='true' ? 'Home' : 'Login'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="UserBookings" component={UserBookings} />
        <Stack.Screen name="BookingDetails" component={BookingDetails} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
        <Stack.Screen name="SelectSlot" component={SelectSlot} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
