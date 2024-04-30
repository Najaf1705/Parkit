import React, { useEffect, useState } from "react";
import { View, Text, Button, Linking } from "react-native";
import RNUpiPayment from "react-native-upi-payment";

const PaymentScreen = ({navigation}) => {

  const paymentGateway=()=>{
    RNUpiPayment.initializePayment(
      {
        vpa: 'najafshaikh1705-1@okicici', // or can be john@ybl or mobileNo@upi
        payeeName: 'Najaf Shaikh',
        amount: '1',
        transactionRef: 'aasf-332-aoei-fn',
      },
      successCallback,
      failureCallback
    );
  }

  function successCallback(data){
    console.log(data);
  }
  function failureCallback(data){
    console.log(data);
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Pay" onPress={paymentGateway}/>
    </View>
  );
};

export default PaymentScreen;
