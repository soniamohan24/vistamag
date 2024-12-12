import React, { useState } from 'react';
import { SafeAreaView,Alert, Text, TextInput, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleRegister = () => {
    if (!fname || !lname || !username || !password || !reEnterPassword || !phone) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    if (password !== reEnterPassword) {
      ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
      return;
    }

    const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "fname": fname,
  "lname": lname,
  "phone": phone,
  "uname": username,
  "password": password
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};


    fetch("http://192.168.12.101:9090/users/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          ToastAndroid.show('Registration Successful', ToastAndroid.SHORT);
          navigation.goBack();
        } else {
          Alert.alert(
            'Registration Failed',
            result.message,
            [
                { text: 'OK', onPress: () => console.log('OK pressed') }
            ],
            { cancelable: false }
        );
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor={"grey"}
        value={fname}
        onChangeText={setFname}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor={"grey"}
        value={lname}
        onChangeText={setLname}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={"grey"}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"grey"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        placeholderTextColor={"grey"}
        secureTextEntry
        value={reEnterPassword}
        onChangeText={setReEnterPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={"grey"}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'black',
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
