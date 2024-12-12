
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Dropdown picker
import DateTimePicker from '@react-native-community/datetimepicker'; // Calendar picker

const AddVisitScreen = ({ navigation, route }) => {
  const [visits, setVisits] = useState([]); // Data for dropdown
  const [selectedVisitor, setSelectedVisitor] = useState(''); // Selected visitor
  const [destinationApartment, setDestinationApartment] = useState('');
  const [date, setDate] = useState(new Date());
  const [ssn, setSsn] = useState('');
  const [phone, setPhone] = useState('');
  const [last4SIN, setLast4SIN] = useState('');
  const [lastAddress, setLastAddress] = useState('');
  const [loading, setLoading] = useState(true); // Loading state for fetching visitors
  const [showDatePicker, setShowDatePicker] = useState(false); // Manage DatePicker visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    // If visits are passed via route params, set them
    
    setVisits(route.params.visits || []); 
    setLoading(false);
  }, [route.params.visits]);

  const handleAddVisit = async () => {
    // Ensure required fields are filled
    if (!selectedVisitor || !destinationApartment || !date  || !last4SIN || !lastAddress) {
      setErrorMessage('Some fields are missing. Please fill all the fields.');
      return;
    }
  
    setErrorMessage(''); // Clear error message if all fields are filled
  
    const raw = JSON.stringify({
      "visitor_id": selectedVisitor,
      "destination_apartment": destinationApartment,
      "approve_status": "Pending"
    });
  
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: raw,
      redirect: "follow"
    };
  
    try {
      const response = await fetch("http://192.168.12.101:9090/visits/log", requestOptions);
      const result = await response.json();
  
      if (result.status === 200) {
        ToastAndroid.show('Visit added successfully!', ToastAndroid.SHORT);
        navigation.goBack(); // Go back to the previous screen
      } else {
        console.error('Failed to add visit:', result);
        ToastAndroid.show('Failed to add visit', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error adding visit:', error);
      ToastAndroid.show('An error occurred while adding the visit', ToastAndroid.SHORT);
    }
  };
  


  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Visit</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Display Error Message */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Dropdown for selecting visitor */}
          <Text style={styles.label}>Visitor Name:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVisitor}
              onValueChange={(itemValue) => setSelectedVisitor(itemValue)}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Visitor" value="" />
              {visits.map((visitor) => (
                <Picker.Item key={visitor.id} label={visitor.name} value={visitor.id} />
              ))}
            </Picker>
          </View>

          {/* Destination Apartment */}
          <Text style={styles.label}>Destination Apartment:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Destination Apartment"
            value={destinationApartment}
            onChangeText={setDestinationApartment}
          />

          {/* Date Picker */}
          <Text style={styles.label}>Visit Date:</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)} // Open the date picker
          >
            <Text style={{ color: date ? 'black' : 'gray' }}>
              {date ? date.toDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>

          {/* Display DateTimePicker if showDatePicker is true */}
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {/* Phone */}
          <Text style={styles.label}>Alternate Phone:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Last 4 digits of SIN */}
          <Text style={styles.label}>Last 4 digits of SIN:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Last 4 digits of SIN"
            keyboardType="number-pad"
            value={last4SIN}
            onChangeText={setLast4SIN}
          />

          {/* Last Address */}
          <Text style={styles.label}>Last Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Last Address"
            value={lastAddress}
            onChangeText={setLastAddress}
          />

          {/* Submit Button */}
          <TouchableOpacity style={styles.button} onPress={handleAddVisit}>
            <Text style={styles.buttonText}>Add Visit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AddVisitScreen;

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
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'black',
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'white',
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
