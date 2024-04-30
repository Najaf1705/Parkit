import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BookingDetails from './BookingDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewDetails = ({ navigation }) => {
  const [vehicleType, setVehicleType] = useState('Select');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isVehicleTypeValid, setVehicleTypeValid] = useState(true);
  const [isVehicleModelValid, setVehicleModelValid] = useState(true);
  const [isVehicleNumberValid, setVehicleNumberValid] = useState(true);

  const vehicleTypes = ['Sedan', 'MUV/SUV', 'Hatchback', 'Convertible', 'Coupe', 'Crossover'];

  const handleAddVehicle = async () => {
    // Validate all fields before adding a vehicle
    if (!validateFields()) {
      return;
    }

    // Handle adding vehicle details, you can implement your logic here
    const email=await AsyncStorage.getItem('email');
    const name=await AsyncStorage.getItem('name');
    console.log('Adding vehicle:', { vehicleType, vehicleModel, vehicleNumber, email });
    navigation.navigate('BookingDetails', { vehicleType: vehicleType,
      vehicleModel: vehicleModel,
      vehicleNumber: vehicleNumber,
      email: email,
      name: name
     });

    setVehicleType("Select");
    setVehicleModel("");
    setVehicleNumber("");
    // You can navigate to another screen or perform any other action after adding the vehicle
  };

  const validateFields = () => {
    // Validate each field
    const isTypeValid = vehicleType !== 'Select';
    const isModelValid = !!vehicleModel.trim();
    const isNumberValid = !!vehicleNumber.trim();

    setVehicleTypeValid(isTypeValid);
    setVehicleModelValid(isModelValid);
    setVehicleNumberValid(isNumberValid);

    return isTypeValid && isModelValid && isNumberValid;
  };

  return (
    <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 210, 0, 0.3)']} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add Vehicle</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select vehicle type</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.dropdownButtonText}>{vehicleType}</Text>
            <Ionicons name="caret-down-outline" size={20} color="black" />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              {vehicleTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setVehicleType(type);
                    setDropdownVisible(false);
                  }}
                >
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!isVehicleTypeValid && <Text style={styles.alert}>Please select vehicle type</Text>}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Vehicle Model</Text>
            <TextInput
              placeholder="Enter vehicle model"
              style={[styles.input, !isVehicleModelValid && styles.inputError]}
              value={vehicleModel}
              onChangeText={(text) => setVehicleModel(text)}
            />
            {!isVehicleModelValid && <Text style={styles.alert}>Please enter vehicle model</Text>}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Register Number</Text>
            <TextInput
              placeholder="Enter vehicle register number"
              style={[styles.input, !isVehicleNumberValid && styles.inputError]}
              value={vehicleNumber}
              onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
              />
            {!isVehicleNumberValid && <Text style={styles.alert}>Please enter vehicle register number</Text>}
          </View>
          <TouchableOpacity style={styles.buttonStyle} onPress={handleAddVehicle}>
            <Text style={styles.buttonTextStyle}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flex: 1,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 4,
  },
  inputContainer: {
    marginTop: 50,
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#52006A',
    borderRadius: 5,
    padding: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  dropdownItem: {
    paddingVertical: 5,
  },
  inputWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  label: {
    margin: 'auto',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  alert: {
    color: 'red',
    fontSize: 12,
  },
  buttonStyle: {
    backgroundColor: 'rgba(290, 210, 0, 1)',
    paddingVertical: 10,
    paddingHorizontal: 140,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonTextStyle: {
    fontSize: 17,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ViewDetails;
