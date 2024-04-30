import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { firestore_DB } from '../../db/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const PRICE_PER_HOUR = 100;

const BookingDetails = ({ route, navigation }) => {
  const { vehicleType, vehicleModel, vehicleNumber, email, name } = route.params;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [startHour, setStartHour] = useState('00');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('00');
  const [endMinute, setEndMinute] = useState('00');
  const [totalPrice, setTotalPrice] = useState(null);
  const [selectingStartDate, setSelectingStartDate] = useState(true); // Track whether selecting start date or end date

  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().slice(0, 10);

  const handleDayPress = (day) => {
    if (selectingStartDate) {
      setSelectedStartDate(day.dateString);
    } else {
      setSelectedEndDate(day.dateString);
    }
  };

  // Function to switch between selecting start and end date
  const switchDateSelection = () => {
    setSelectingStartDate(!selectingStartDate);
  };

  const countOverlappingBookings = async (selectedStartTime, selectedEndTime) => {
    try {
      let count = 0;
      const userBookingsRef = collection(firestore_DB, "user_bookings");

      // Get all documents from the collection
      const querySnapshot = await getDocs(userBookingsRef);

      querySnapshot.forEach((doc) => {
        // Extract document data
        const data = doc.data();
        const entryTime = data.entry_time.toDate();
        const exitTime = data.exit_time.toDate();

        // Check if selectedStartTime is within the entry and exit times
        if ((selectedStartTime >= entryTime && selectedStartTime <= exitTime) ||
          (selectedEndTime >= entryTime && selectedEndTime <= exitTime)) {
          count++;
        }
      });
      console.log(count);
      return count > 2;
    } catch (error) {
      console.error("Error counting overlapping bookings:", error);
      throw error;
    }
  };

  const handleContinue = async () => {
    const selectedStartTime = new Date(selectedStartDate + 'T' + startHour + ':' + startMinute + ':00');
    const selectedEndTime = new Date(selectedEndDate + 'T' + endHour + ':' + endMinute + ':00');

    if (!selectedStartDate) {
      Alert.alert('Invalid Date', 'Please select start date.');
      return;
    }

    if (!selectedEndDate) {
      Alert.alert('Invalid Date', 'Please select end date.');
      return;
    }
    
    if (selectedStartTime < currentDate) {
      Alert.alert('Invalid Start time', 'Start time cant be in past.');
      return;
    }

    if (selectedStartTime>=selectedEndTime) {
      Alert.alert('Invalid Time', 'End time must be greater than start time.');
      return;
    }
    
    const durationInMs = selectedEndTime - selectedStartTime;
    const durationInHours = durationInMs / (1000 * 60 * 60); // Round up to the nearest 30 minutes
    if(durationInHours>7*24){
      Alert.alert('Time Limit Exceeded', "Can't book for more than a week.");
      return;
    }

    const overlappingBookings = await countOverlappingBookings(selectedStartTime, selectedEndTime);
    if (overlappingBookings) {
      Alert.alert('Slots full', 'Sorry No slots available for the selected time.');
      return;
    }

    const totalPrice = durationInHours * PRICE_PER_HOUR;
    setTotalPrice(totalPrice);

    // if (durationInMinutes <= 0) {
    //   Alert.alert('Invalid Time', 'End time must be greater than start time.');
    //   return;
    // }

    const addBooking = async () => {
      try {
        const collectionRef = collection(firestore_DB, 'user_bookings');

        const newData = {
          email: email,
          entry_time: selectedStartTime,
          exit_time: selectedEndTime,
          fees: totalPrice,
          plate_no: vehicleNumber.toLowerCase(),
          v_model: vehicleModel,
          v_type: vehicleType,
        };

        await addDoc(collectionRef, newData);
        navigation.navigate('UserBookings', { email: email, name: name });
        console.log("User data inserted successfully");
      } catch (error) {
        console.log("Error:", error);
      }
    };

    addBooking();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 210, 0, 0.3)']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Booking Details</Text>
        </View>

        <View style={styles.content}>
          {selectingStartDate ? (
            <>
              <Text style={[styles.label, styles1.label]}>Select Start Date</Text>
              <View style={styles1.calendarContainer}>
                <Calendar
                  current={currentDateString}
                  minDate={currentDateString}
                  maxDate={'2026-12-31'}
                  hideExtraDays={true}
                  onPressArrowLeft={subtractMonth => subtractMonth()}
                  onPressArrowRight={addMonth => addMonth()}
                  markedDates={{
                    [selectedStartDate]: { selected: true, selectedColor: 'rgba(255, 210, 0, 1)' },
                  }}
                  onDayPress={handleDayPress}
                />
              </View>
              <View style={styles1.timeContainer}>
                <View style={styles1.timeInput}>
                  <Text style={styles.label}>Start hour</Text>
                  <View style={styles1.timePickerContainer}>
                    <Picker
                      selectedValue={startHour}
                      onValueChange={(itemValue) => setStartHour(itemValue)}
                      style={[styles1.picker, { height: 50 }]} // Adjust height here
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour.toString()} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles1.timeInput}>
                  <Text style={styles.label}>Start minute</Text>
                  <View style={styles1.timePickerContainer}>
                    <Picker
                      selectedValue={startMinute}
                      onValueChange={(itemValue) => setStartMinute(itemValue)}
                      style={[styles1.picker, { height: 50 }]} // Adjust height here
                    >
                      <Picker.Item label="00" value="00" />
                      <Picker.Item label="30" value="30" />
                    </Picker>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.buttonStyle, styles1.continueButton]} onPress={switchDateSelection}>
                <Text style={styles.buttonTextStyle}>{selectingStartDate ? 'Select End Date' : 'Select Start Date'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.label, styles1.label]}>Select End Date</Text>
              <View style={styles1.calendarContainer}>
                <Calendar
                  current={currentDateString}
                  minDate={selectedStartDate || '2024-03-16'}
                  maxDate={'2026-12-31'}
                  hideExtraDays={true}
                  onPressArrowLeft={subtractMonth => subtractMonth()}
                  onPressArrowRight={addMonth => addMonth()}
                  markedDates={{
                    [selectedEndDate]: { selected: true, selectedColor: 'rgba(255, 210, 0, 1)' },
                  }}
                  onDayPress={handleDayPress}
                />
              </View>
              <View style={styles1.timeContainer}>
                <View style={styles1.timeInput}>
                  <Text style={styles.label}>End hour</Text>
                  <View style={styles1.timePickerContainer}>
                    <Picker
                      selectedValue={endHour}
                      onValueChange={(itemValue) => setEndHour(itemValue)}
                      style={[styles1.picker, { height: 50 }]} // Adjust height here
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <Picker.Item key={hour} label={hour.toString().padStart(2, '0')} value={hour.toString()} />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={styles1.timeInput}>
                  <Text style={styles.label}>End minute</Text>
                  <View style={styles1.timePickerContainer}>
                    <Picker
                      selectedValue={endMinute}
                      onValueChange={(itemValue) => setEndMinute(itemValue)}
                      style={[styles1.picker, { height: 50 }]} // Adjust height here
                    >
                      <Picker.Item label="00" value="00" />
                      <Picker.Item label="30" value="30" />
                    </Picker>
                  </View>
                </View>
              </View>
              <View style={styles1.priceContainer}>
                <Text style={[styles.label, styles1.priceLabel]}>Price</Text>
                <Text style={styles1.priceText}>{PRICE_PER_HOUR} Rs. / per hr</Text>
              </View>

              <View style={styles1.priceContainer1}>
                <Text style={styles.label}>Total Price</Text>
                <Text style={styles.priceText}>{totalPrice ? `${totalPrice} Rs.` : ''}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.buttonStyle, styles1.continueButton]} onPress={switchDateSelection}>
                  <Text style={styles.buttonTextStyle}>{selectingStartDate ? 'Select End Time' : 'Change Start Time'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonStyle, styles1.continueButton]} onPress={handleContinue}>
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </TouchableOpacity>
              </View>

            </>
          )}

          {/* Rest of your code... */}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonTextStyle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: '10%',
  },
});

const styles1 = StyleSheet.create({
  calendarContainer: {
    width: '80%',
    marginHorizontal: '10%',
    marginVertical: 20,
    padding: 3,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '10%',
    marginVertical: 10,
  },
  timeInput: {
    flex: 1,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingHorizontal: 10, // Add padding
  },
  picker: {
    flex: 1,
    backgroundColor: 'transparent', // Set background color to transparent
    color: 'black', // Set text color to black
    paddingHorizontal: 5, // Add padding
    fontSize: 16, // Increase font size for better readability
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  priceContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
  },
});

export default BookingDetails;
