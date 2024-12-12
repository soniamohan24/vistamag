import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';

const AddVisitor = () => {
  // State variables for form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ssn, setSsn] = useState('');
  const [lastAddress, setLastAddress] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Error message for validation

  // Function to handle the registration
  const handleRegister = async () => {
    // Basic validation to check if all fields are filled
    if (!name || !phone || !ssn || !lastAddress || !referredBy) {
      setErrorMessage('All fields are required!');
      return;
    }

    // Validate SSN to be exactly 4 digits long
    const ssnRegex = /^\d{4}$/;
    if (!ssnRegex.test(ssn)) {
      setErrorMessage('Invalid SSN value!');
      return;
    }

    setErrorMessage(''); // Clear any previous error messages

    // Prepare the payload for the POST request
    const raw = JSON.stringify({
      "name": name,
      "phone": phone,
      "ssn": ssn,
      "last_address": lastAddress,
      "referred_by": referredBy
    });

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch("http://192.168.12.101:9090//visitors/register", requestOptions);
      const result = await response.json();

      if (response.ok) {
        ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
        // Clear the form fields upon successful registration
        setName('');
        setPhone('');
        setSsn('');
        setLastAddress('');
        setReferredBy('');
      } else {
        console.error('Registration failed:', result);
        ToastAndroid.show('Failed to register. Try again.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visitor Registration</Text>

      {/* Display Error Message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Name Field */}
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Phone Field */}
      <Text style={styles.label}>Phone:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* SSN Field */}
      <Text style={styles.label}>SSN:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter SSN"
        keyboardType="number-pad"
        value={ssn}
        onChangeText={setSsn}
      />

      {/* Last Address Field */}
      <Text style={styles.label}>Contact Address:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the address"
        value={lastAddress}
        onChangeText={setLastAddress}
      />

      {/* Referred By Field */}
      <Text style={styles.label}>Whom do you want to visit?:</Text>
      <TextInput
        style={styles.input}
        placeholder="Apartment #, Owner name"
        value={referredBy}
        onChangeText={setReferredBy}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddVisitor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
