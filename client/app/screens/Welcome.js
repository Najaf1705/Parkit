import React, { useEffect } from "react";
import { View, StyleSheet, Text, ImageBackground, Image } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import Login from "./Login.js";

const Welcome = ({route, navigation}) => {
    // const navigation = useNavigation();
    const {isLoggedIn} = route.params;

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Login');
        }, 1000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View>
            <ImageBackground source={require("../assets/WelcomeImg.png")} style={{ height: '100%', position: 'relative' }}>
                <View>
                    <Text style={styles.welcomeStyle}>
                        Quick Parking!
                    </Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image source={require("../assets/parking_icon.png")} style={styles.icon} />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    welcomeStyle: {
        fontSize: 27,
        color: 'black',
        textShadowColor: 'rgba(255, 255, 255, 1)',
        textShadowOffset: { width: 0.1, height: 0.1 },
        textShadowRadius: 1,
        marginTop: '60%',
        //margin: '11%',
        textAlign: 'center',
        lineHeight: 36,
    },
    iconContainer: {
        position: 'absolute',
        bottom:'75%',
        left: '50%',
        transform: [{ translateX: -25 }],
        width: 50,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 40,
        height: 40,
    }
});

export default Welcome;