
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
  ImageBackground,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = ({ route }) => {
  const { name, uname, phone,loginType,city } = route.params; // Get user data passed from Login
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching visits
  const navigation = useNavigation();
  const [weather, setWeather] = useState(null); // State for weather details
  const [visitors, setVisitors] = useState([]);
  useEffect(() => {
    // Fetch the visits data from the API when the screen loads
    fetchVisits();
    fetchWeather();
    fetchvisitors();
    updateLocation();
  }, []);


  const [location, setLocation] = useState({
    latitude: 53.349805,
    longitude: -6.26031,
  });

  const updateLocation = async () => {
    try {
      const response = await fetch('http://your-api-url.com/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      });

      const data = await response.json();
      console.log('Location updated successfully:', data);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  useEffect(() => {
    // Call updateLocation every 10 minutes (600000 ms)
    const intervalId = setInterval(() => {
      updateLocation();
    }, 600000); // 10 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [location]);

  const fetchvisitors = async () => {
    try {
      const response = await fetch('http://192.168.12.101:9090/visitors');
      const result = await response.json();
      if (result.status === 200) {
        setVisitors(result.data); // Set the fetched visits to state
      } else {
        console.error('Failed to fetch visits');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };
  const fetchVisits = async () => {
    try {
      const response = await fetch('http://192.168.12.101:9090/visits');
      const result = await response.json();
      if (result.status === 200) {
        setVisits(result.data); // Set the fetched visits to state
      } else {
        console.error('Failed to fetch visits');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false); // Stop loading after fetch
    }
  };

  const fetchWeather1 = () => {
    try {
      const weatherData = {
        cloudcover: 75,
        description: 'Partly cloudy',
        feelslike: 1,
        humidity: 87,
        icon: 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png',
        location: {
          city: 'Dublin',
          country: 'Ireland',
          latitude: '53.333',
          longitude: '-6.249',
          timezone: 'Europe/Dublin',
        },
        precipitation: 0,
        pressure: 1039,
        temperature: 5,
        time: '04:56 AM',
        visibility: 10,
        wind_degree: 35,
        wind_speed: 25,
      };

      setWeather({
        temp: weatherData.temperature,
        description: weatherData.description,
        icon: weatherData.icon,
        city: weatherData.location.city,
        feelsLike: weatherData.feelslike,
        windSpeed: weatherData.wind_speed,
        humidity: weatherData.humidity,
        location: weatherData.location.city,
        country: weatherData.location.country,
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const sendMessageToWhatsApp = (phoneNumber, message,id) => {
    message = "Welcome to VistaMag!!!\nYour Reference Visit ID :"+id+" Your OTP for checkout process is : "+message
    let url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    
    Linking.openURL(url)
      .then((supported) => {
        if (!supported) {
          console.log('WhatsApp is not installed on this device');
        } else {
          console.log('WhatsApp opened successfully');
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
      });
  };
  
const shareOTP = async(id) =>{

  const generatcode = Math.floor(1000 + Math.random() * 9000);
  sendMessageToWhatsApp("+917892948615",generatcode,id)
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "visit_id": id,
  "top_generated": generatcode,
  "user_name": "test"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://192.168.12.101:9090/visits/addotp", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
}



  const fetchWeather = async () => {
    try {
      const raw = "";

const requestOptions = {
  method: "GET",
  body: raw,
  redirect: "follow"
};
fetch(`http://192.168.12.101:9090/wheather/?city=${city}`, requestOptions)
.then((response) => response.json())
  .then((result) => {console.log(result.icon)
    
      setWeather({
        temp: result.temperature,
          description: result.description,
          icon: result.icon,
          city:result.location.city,
          feelsLike: result.feelslike,
          windSpeed: result.wind_speed,
          humidity: result.humidity,
          location: result.name,
          country: result.location.country,
      });
   
  })
  .catch((error) => console.error(error));
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };
  
  // Update Visit Status API
  const updateVisitStatus1 = async (id,item) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var status = "Completed"
    Alert.alert("status",item.approve_status)
    if(item.approve_status =="Pending")
      status = "CheckIn"
      
    const raw = JSON.stringify({
      status: status,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(`http://192.168.12.101:9090/visits/update/${id}`, requestOptions);
      if (response.ok) {
        fetchVisits(); // Refresh the visit list

        if(status == "CheckIn"){
          shareOTP(id)
        }
      } else {
        console.error("Failed to update visit status");
      }
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };


  const updateVisitStatus = async (id, item) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var status = "Completed";
    Alert.alert("Status", item.approve_status);
  
    if (item.approve_status == "Pending") status = "CheckIn";
    else if (item.approve_status == "CheckIn") {
      // Show confirmation dialog before checkout
      Alert.alert(
        "Confirm Checkout",
      "Please confirm that the OTP has been checked and verified in person before proceeding with checkout.",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Checkout canceled"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: async () => {
              // Proceed with the checkout if confirmed
              const raw = JSON.stringify({
                status: "Completed", // Update the status to "Completed"
              });
  
              const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
              };
  
              try {
                const response = await fetch(
                  `http://192.168.12.101:9090/visits/update/${id}`,
                  requestOptions
                );
                if (response.ok) {
                  fetchVisits(); // Refresh the visit list
  
                  // Proceed with sharing OTP if needed
                  shareOTP(id);
                } else {
                  console.error("Failed to update visit status");
                }
              } catch (error) {
                console.error("Error updating visit status:", error);
              }
            }
          }
        ]
      );
    }
  };
  
  const handleVerifyVisit = () => {
    // Navigate to verify visit screen
    navigation.navigate('AddVisitor', {
      name: name,
      uname: uname,
      phone: phone,
      visits: visits
    });
  };
  const handleAddVisit = () => {
    // Navigate to add visit screen
    navigation.navigate('AddVisits', { visits: visitors });
  };

  const handleVisitHistory = () => {
    // Navigate to visit history screen
    navigation.navigate('VisitorScreen');
  };

  // Render a single visit item
  const renderVisitItem = ({ item }) => (
    <View style={styles.visitItem}>
      <View style={styles.row}>
        <Text style={styles.visitText}>Visit ID: {item.id}</Text>
        <Text style={styles.visitText}>Name: {item.visitor_name}</Text>
        <Text style={styles.visitText}>Phone: {item.visitor_phone}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.visitText}>Apartment: {item.destination_apartment}</Text>
        <Text
          style={[
            styles.visitStatus,
            { color: item.approve_status === "Completed" ? "green" :item.approve_status === "CheckIn"? "red":"orange" },
          ]}
        >
          Status: {item.approve_status}
        </Text>
      </View>
      <View style={styles.row}>
      {item.approve_status === "Pending" && (
  <TouchableOpacity
    style={styles.checkinButton}
    onPress={() => updateVisitStatus(item.id,item)}
  >
    <Text style={styles.checkinButtonText}>Check In</Text>
  </TouchableOpacity>
)}

{item.approve_status === "CheckIn" && (
  <TouchableOpacity
    style={styles.checkinButton}
    onPress={() => updateVisitStatus(item.id,item)}
  >
    <Text style={styles.checkinButtonText}>Check Out</Text>
  </TouchableOpacity>
)}
      </View>
    </View>
  );

  // Separate visits into sections
  const pendingVisits = visits.filter((visit) => visit.approve_status === "Pending");
  const completedVisits = visits.filter((visit) => visit.approve_status === "Completed");
  const checkinVisits = visits.filter((visit) => visit.approve_status === "CheckIn");
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // Clear any necessary data here if needed, e.g., clear authentication token, etc.
            navigation.goBack();  // Go back to the previous screen
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
       source={require('../components/assets/images/imgbg.jpg')} // URL or local path of the background image
       style={styles.backgroundImage} // Style for the background image
       imageStyle={styles.imageStyle} // You can also style the image directly if needed
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Details Section */}
        <View style={styles.userSection}>
  {/* <Image
    source={{ uri: 'https://via.placeholder.com/150' }}
    style={styles.userImage}
  /> */}
  
  <View style={styles.userDetails}>
    
    <Text style={styles.userName}> Hi {name}</Text>
    {/* <Text style={styles.userText}>Username: {uname}</Text>
    <Text style={styles.userText}>Phone: {phone}</Text> */}
  </View>
  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Image
              source={require('../components/assets/images/logout.png')}  // Update with the correct path to your logout image
              style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>

</View>
{/* User and Weather Section */}
<View style={styles.weatherSection}>
  {weather ? (
    <>
      <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
      <View>
        <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
        <Text style={styles.weatherDescription}>{weather.description}</Text>
        <Text style={styles.weatherLocation}>
          {weather.city}, {weather.country}
        </Text>
        <Text style={styles.weatherDetails}>
          Feels Like: {weather.feelsLike}°C | Humidity: {weather.humidity}%
        </Text>
        <Text style={styles.weatherDetails}>
          Wind Speed: {weather.windSpeed} km/h
        </Text>
      </View>
    </>
  ) : (
    <ActivityIndicator size="small" color="#FFC300" />
  )}
</View>
        {/* Visit Section */}
        <View style={styles.visitSection}>
          <TouchableOpacity style={styles.button} onPress={handleVerifyVisit}>
            <Text style={styles.buttonText}>Add Visitor</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddVisit}>
            <Text style={styles.buttonText}>Add Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleVisitHistory}>
            <Text style={styles.buttonText}>Manage Visitor</Text>
          </TouchableOpacity>
        </View>

        {/* Visit List Section
        <View style={styles.visitListSection}>
          <Text style={styles.sectionTitle}>Visit List</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#FFC300" />
          ) : (
            <FlatList
              data={visits}
              renderItem={renderVisitItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>No visits available.</Text>}
            />
          )}
        </View> */}


        {/* Pending Visits */}
        <View style={styles.visitListSection}>
          <Text style={styles.sectionTitle}>Pending Visits</Text>
          <FlatList
            data={pendingVisits}
            renderItem={renderVisitItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No pending visits.</Text>}
          />
        </View>

        {/* Completed Visits */}
        <View style={styles.visitListSection}>
          <Text style={styles.sectionTitle}>Completed Visits</Text>
          <FlatList
            data={completedVisits}
            renderItem={renderVisitItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No completed visits.</Text>}
          />
        </View>

        {/* Checked In Visits */}
        <View style={styles.visitListSection}>
          <Text style={styles.sectionTitle}>Checked In Visits</Text>
          <FlatList
            data={checkinVisits}
            renderItem={renderVisitItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text style={styles.emptyText}>No checked-in visits.</Text>}
          />
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E213A', // Dark background
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  userSection: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically center content
    justifyContent: 'space-between', // Space out items
    padding: 5, // Add padding for spacing
    backgroundColor: '#303A52',
    marginBottom: 5, // Space below the section
    borderRadius: 10, // Rounded corners
    elevation: 3, // Shadow effect (Android)
    shadowColor: '#000', // Shadow color (iOS)
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height:60
  },
  userImage: {
    width: 60, // Reduced image size
    height: 60,
    borderRadius: 30, // Circular image
    marginRight: 10,
  },
  userDetails: {
    flex: 1, // Take up remaining space
    marginLeft: 10, // Add space between image and details
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFC300',
  },
  userText: {
    fontSize: 14,
    color: '#555',
  },
  notificationIcon: {
    padding: 10, // Add padding for touchable area
    justifyContent: 'center', // Center icon
    alignItems: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
    tintColor: 'black', // Optional: tint for consistent color
  },
  visitSection: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#FFC300',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1E213A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitListSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  visitItem: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#D9D9D9", // Lighter background
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom:10,
    padding: 10,
    backgroundColor: '#87CEEB',
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  weatherDescription: {
    fontSize: 16,
    color: 'black',
    textTransform: 'capitalize',
  },
  weatherLocation:{
    fontSize: 16,
    color: 'black',
    fontWeight:'bold'
  },
  visitText: {
    fontSize: 14,
    marginHorizontal: 5,
  },
  emptyText: {
    color: '#A9A9A9',
    textAlign: 'center',
  },
  visitStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows the items to wrap to the next line if needed
    justifyContent: "space-between", // Ensures space is distributed
    alignItems: "center",
    marginBottom: 5,
  },
  checkinButton: {
    backgroundColor: "#FFC300",
    padding: 5,
    borderRadius: 5,
  },
  checkinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Align content in the center vertically
    alignItems: 'center', // Align content in the center horizontally,
    width:"100%"

  },
  imageStyle: {
    opacity: 0.3, // Optionally reduce opacity to make text more readable
  },
  // ... other styles
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: '90%',
    transform: [{ translateX: -75 }],
    backgroundColor: 'transparent',  // Transparent background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',  // Align the icon and text horizontally
    alignItems: 'center',  // Vertically center the content
  },
  logoutIcon: {
    width: 24,  // Set the desired width for the logout icon
    height: 24, // Set the desired height for the logout icon
    marginRight: 10,  // Space between icon and text
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,  // Adjust font size if needed
  },
});
