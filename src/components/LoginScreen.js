
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  Image,Alert,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // Dropdown picker

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("security"); // State for login type
  const [cities, setCities] = useState([]); // State for cities
  const [selectedCity, setSelectedCity] = useState(""); // State for selected city

  useEffect(() => {
    // Fetch cities from API
    const fetchCities = async () => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "http://192.168.12.101:9090/locations/cities",
          requestOptions
        );
        const result = await response.json();
        // setCities(result.data || []); // Set cities from the API response
        console.log("result",result)
        // Transform city names to objects with id and name
      if (result && Array.isArray(result)) {
        setCities(
          result.map((city, index) => ({
            id: index + 1, // Generate a unique id
            name: city,    // Use the city name
          }))
        );
      } else {
        // Set default city if result is null or invalid
        setCities([{ id: 1, name: "Dublin" }]);
      }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleLogin = () => {
    // Prepare login details based on selected type and city
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      uname: username,
      password: password,
      loginType: loginType, // Add loginType to the request payload
      city: selectedCity, // Include the selected city
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://192.168.12.101:9090/users/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          ToastAndroid.show("Login Successful", ToastAndroid.SHORT);
          if (loginType === "security")
            navigation.navigate("Dashboard", {
              name: result.details.name,
              uname: result.details.uname,
              phone: result.details.phone,
              loginType: loginType, // Pass the loginType to the dashboard
              city: selectedCity, // Pass the selected city to the dashboard
            });
          else
            navigation.navigate("DashboardOwner", {
              name: result.details.name,
              uname: result.details.uname,
              phone: result.details.phone,
              loginType: loginType, // Pass the loginType to the dashboard
              city: selectedCity, // Pass the selected city to the dashboard
            });
        } else {
          // ToastAndroid.show("Invalid Credentials", ToastAndroid.SHORT);
          Alert.alert(
            'Login Failed',
            result.message,
            [
                { text: 'OK', onPress: () => console.log('OK pressed') }
            ],
            { cancelable: false }
        );
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../components/assets/images/secure.jpeg")} // Background image
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <Text style={styles.heading}>Vista Mag</Text>
        <Text style={styles.caption}>Your security partner</Text>

        <Image
          source={require("../components/assets/images/logo.png")} // Logo image
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.loginTitle}>Login</Text>

        {/* Picker for login type selection */}
        <Picker
          selectedValue={loginType}
          style={styles.picker}
          onValueChange={(itemValue) => setLoginType(itemValue)}
        >
          <Picker.Item label="I am an Owner" value="owner" />
          <Picker.Item label="I am a Security" value="security" />
        </Picker>

       {/* Picker for selecting a city */}
        <Picker
          selectedValue={selectedCity}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCity(itemValue)}
        >
          <Picker.Item label="Select a City" value="" />
          {cities.map((city) => (
            <Picker.Item key={city.id} label={city.name} value={city.name} />
          ))}
        </Picker>


        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={"grey"}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={"grey"}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageStyle: {
    opacity: 0.3,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,       // Adjust the size as needed
    fontWeight: 'bold', // Makes the text bold
    textAlign: 'center', // Centers the heading
    color: '#333',      // Sets the color of the text
    marginVertical: 10, // Adds space above and below the heading
  },

  caption:{
    fontSize: 14,       // Adjust the size as needed
    textAlign: 'center', // Centers the heading
    color: '#333',      // Sets the color of the text
    marginVertical: -10, // Adds space above and below the heading
    paddingBottom:30
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'black', // Text color inside the input field (black)
    marginBottom: 15,
  },
  picker: {
    width: '80%',
    marginBottom: 15,
    color:'white',
    backgroundColor:'#315A72'
  },
  loginButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    padding: 15,
    width: '80%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
