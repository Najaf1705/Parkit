import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground, Platform, StatusBar } from "react-native";
import { firestore_DB } from '../../db/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore modular SDK functions
import AsyncStorage from "@react-native-async-storage/async-storage";


const Home = ({ route, navigation }) => {
  const { e } = route.params ||{};
  const { n } = route.params ||{};
  const [email, setEmail] = useState(e||'');
  const [name, setName] = useState(n||'');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        setEmail(storedEmail);

        const storedName = await AsyncStorage.getItem('name');
        setName(storedName);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [e,n]); 



  const handleBookingsPress = async() => {
    const collectionRef = collection(firestore_DB, 'cars_parked'); // Replace 'your_collection_name' with the name of your collection
    const querySnapshot = await getDocs(collectionRef);
    const count = querySnapshot.size;
    if(count<=2){
      navigation.navigate('VehicleDetails');
    }else{
      Alert.alert("Sorry no slots available");
    }
  };

  const handlePastBookingsPress = () => {
    navigation.navigate('UserBookings',{email: email,name: name});
  };

  const handleLogOut = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'false');
    navigation.navigate('Login');
  };

  // const handlePaymentPress = () => {
  //   navigation.navigate('PaymentScreen'); // Navigate to the PaymentScreen
  // };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Parkit</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View>
        {/* <Text style={styles.welcomeText}>Welcome, {email}</Text> */}
        <Text style={styles.welcomeText}>Welcome, {name}</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleBookingsPress}>
          <Text style={styles.buttonText}>Book Slot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePastBookingsPress}>
          <Text style={styles.buttonText}>Your Bookings</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button} onPress={handlePaymentPress}>
          <Text style={styles.buttonText}>Go to Payment Screen</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: 25,
    paddingLeft: 25,
  },
  headerText: {
    color: '#007bff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 20,
    // alignSelf: 'center', // Center the text horizontally
    marginTop: 20, // Add top margin for spacing
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 200, // Add top margin to make space for the header
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 20,
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  logoutButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
