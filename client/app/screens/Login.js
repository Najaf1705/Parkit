import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ImageBackground, Platform, StatusBar } from "react-native";
import { firestore_DB } from '../../db/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore modular SDK functions
import AsyncStorage from "@react-native-async-storage/async-storage";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// import argon2 from 'argon2';


const Login = ({navigation}) => {
  // const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState('');
  const [userExistsError, setUserExistsError] = useState('');


  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleButtonPress = async () => {
    setEmailError('');
    setPasswordError('');
    setUserExistsError('');

    if (!isValidEmail(email)) {
      setEmailError('Invalid email');
      setTimeout(() => setEmailError(''), 3000); // Clear error after 3 seconds
      return;
    }

    const q = query(collection(firestore_DB, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q); // Execute the query

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();

      if (userData.password!=password) {
        setPasswordError('Invalid credentials');
        setTimeout(() => setPasswordError(''), 3000); // Clear error after 3 seconds
        return;
      }
    } else {
      setUserExistsError("Invalid credentials");
      setTimeout(() => setUserExistsError(''), 3000); // Clear error after 3 seconds
      return;
    }
    console.log("logged in succesfully");
    await AsyncStorage.setItem('isLoggedIn','true');
    // console.log(AsyncStorage.getItem('isLoggedIn'));
    
    const userData = querySnapshot.docs[0].data();
    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('name', JSON.stringify(userData.name));
    navigation.navigate('Home', { e: email, n: userData.name });
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mtitle}>Parkit</Text>
      <Text style={styles.title}>Login</Text>
      {/* <Text style={styles.subtitle}>Please enter your email and password to login.</Text> */}
      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        autoCapitalize="none"
        value={email}
        // keyboardType="phone-pad"
        placeholder="Enter registered email"
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        onChangeText={handlePasswordChange}
        value={password}
        secureTextEntry={true}
        placeholder="Enter password"
        />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
      {userExistsError ? <Text style={styles.error}>{userExistsError}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS==='android'?StatusBar.currentHeight:0,
    backgroundColor: 'rgb(214 255 118)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mtitle: {
    fontSize: 35,
    fontWeight: '600',
    color: "black",
    marginBottom: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: "grey",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: 'grey',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 46,
    width: '80%', // Adjusted width to percentage
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'rgba(290, 210, 0, 1)',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    color: 'grey',
    marginTop: 20,
  },
  error: {
    alignSelf: 'center',
    color: 'red',
    marginBottom: 10,
  },
});

export default Login;
