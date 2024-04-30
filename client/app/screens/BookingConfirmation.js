import React from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./VehicleDetails";
// import { firestore_DB } from '../../db/firebase';
// import {  collection, addDoc, getDoc, getDocs, query, where } from 'firebase/firestore';


const BookingConfirmationScreen = ({ route, navigation }) => {
    // const { selectedSlot } = route.params; // Get the selected slot from navigation params
    const { totalPrice } = route.params;
    const { PRICE_PER_HOUR } = route.params;
    const { selectedDate } = route.params;
    const { vehicleType } = route.params;
    const { vehicleModel } = route.params;
    const { vehicleNumber } = route.params;
    const { email } = route.params;



    const handleGoBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { marginTop: 40 }]}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[styles.headerText, { fontSize: 23 }]}>Booking Confirmation</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Booking Confirmed!</Text>
                <Text style={styles.subtitle}>Thank you for booking with us.</Text>
                {/* <Text style={styles.slot}>{selectedSlot}</Text> */}
                <Text style={styles.slot}>{totalPrice}</Text>
                <Text style={styles.slot}>{PRICE_PER_HOUR}</Text>
                <Text style={styles.slot}>{selectedDate}</Text>

                {/* Add more details about the booking if needed */}
            </View>
        </View>
    );
}

export default BookingConfirmationScreen;