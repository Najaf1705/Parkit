import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from "./VehicleDetails";
import { Ionicons } from '@expo/vector-icons';
import BookingConfirmation from "./BookingConfirmation";


const SlotSelection = ({navigation}) => {
    const [slots, setSlots] = useState([
        { id: 'A1', isTaken: false },
        { id: 'B1', isTaken: true },
        { id: 'A2', isTaken: false },
        { id: 'B2', isTaken: true },
        { id: 'A3', isTaken: false },
        { id: 'B3', isTaken: true },
        { id: 'A4', isTaken: false },
        { id: 'B4', isTaken: false },
        { id: 'A5', isTaken: true },
        { id: 'B5', isTaken: false },
        { id: 'A6', isTaken: false },
        { id: 'B6', isTaken: false },
        { id: 'A7', isTaken: false },
        { id: 'B7', isTaken: false },
        { id: 'A8', isTaken: true },
        { id: 'B8', isTaken: false },
    ]);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const carImageSource = require('../assets/carImg.png');

    const selectSlot = (slotId) => {
        const selectedSlot = slots.find(slot => slot.id === slotId);
        if (selectedSlot && !selectedSlot.isTaken) {
            setSelectedSlot(slotId);
        } else {
            console.log("Slot is already taken.");
        }
    };
    

    const proceedWithSlot = () => {
        if (selectedSlot) {
            console.log("Proceeding with slot:", selectedSlot);
            navigation.navigate('BookingConfirmation', { selectedSlot: selectedSlot });
        } else {
            console.log("Please select a slot.");
        }
    };

    

    return (
        <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 210, 0, 0.3)']} style={styles.container}>
            <View style={styles1.container}>
            <View style={[styles.header, { marginTop: 40 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={[styles.headerText, { fontSize: 23 }]}>Select Slot</Text>
        </View>

                <View style={styles1.slotColumns}>
                    <View style={styles1.slotColumn}>
                        <Text style={styles1.slotColumnTitle}>A Slots</Text>
                        <ScrollView>
                            {slots.filter(slot => slot.id.startsWith('A')).map(slot => (
                                <TouchableOpacity key={slot.id} style={[styles1.slotContainer, selectedSlot === slot.id && styles1.selectedSlot]} onPress={() => selectSlot(slot.id)}>
                                    <Text style={styles1.slotText}>{slot.id}</Text>
                                    {slot.isTaken && <Image source={carImageSource} style={styles1.carImage} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles1.slotColumn}>
                        <Text style={styles1.slotColumnTitle}>B Slots</Text>
                        <ScrollView>
                            {slots.filter(slot => slot.id.startsWith('B')).map(slot => (
                                <TouchableOpacity key={slot.id} style={[styles1.slotContainer, selectedSlot === slot.id && styles1.selectedSlot]} onPress={() => selectSlot(slot.id)}>
                                    <Text style={styles1.slotText}>{slot.id}</Text>
                                    {slot.isTaken && <Image source={carImageSource} style={styles1.carImage} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
                <Button title={`Proceed with ${selectedSlot ? selectedSlot : "selected slot"}`} onPress={proceedWithSlot} disabled={!selectedSlot} color="black" marginTop={40} />
            </View>
        </LinearGradient>
    );
}

const styles1 = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    slotColumns: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    slotColumn: {
        flex: 1,
    },
    slotColumnTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slotContainer: {
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingVertical: 10,
        marginBottom: 10,
        marginTop: 2,
        margin: 10,
    },
    slotText: {
        flex: 1,
        fontWeight: 'bold',
    },
    selectedSlot: {
        backgroundColor: 'grey',
    },
    carImage: {
        width: 90,
        height: 50,
    },
});

export default SlotSelection;