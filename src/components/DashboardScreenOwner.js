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
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DashboardScreenOwner = ({ route }) => {
  const { name, uname, phone } = route.params;
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [code, setCode] = useState('');
  const [signature, setSignature] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchVisits();
    fetchWeather();
  }, []);

  const fetchVisits = async () => {
    try {
      const response = await fetch('http://192.168.12.101:9090/visits');
      const result = await response.json();
      if (result.status === 200) {
        setVisits(result.data);
      } else {
        console.error('Failed to fetch visits');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const raw = "";

      const requestOptions = {
        method: "GET",
        body: raw,
        redirect: "follow"
      };
      fetch("http://192.168.12.101:9090/wheather/?city=Dublin", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result.icon)
          setWeather({
            temp: result.temperature,
            description: result.description,
            icon: result.icon,
            city: result.location.city,
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

  const updateVisitStatus = async () => {
    if (!code || !signature) {
      Alert.alert('Error', 'Please enter the code and signature');
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "top": code,
      "signed_person_name": signature,
      "user_name": uname
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(`http://192.168.12.101:9090/visits/checkout/${selectedVisit.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result.status === 200) {
          setShowModal(false);
          Alert.alert("Message", "Successfully verified and Checkout Process is complete")
          proceedCheckout()
        } else {
          setShowModal(false);
          Alert.alert("Message", result.message)
        }
      })
      .catch((error) => { console.error(error) });
  };

  const proceedCheckout = async () => {
    if (!code || !signature) {
      Alert.alert('Error', 'Please enter the code and signature');
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      status: 'Completed',
      code: code,
      signature: signature,
    });

    const requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch(`http://192.168.12.101:9090/visits/update/${selectedVisit.id}`, requestOptions);
      if (response.ok) {
        setShowModal(false);
        fetchVisits();
      } else {
        console.error('Failed to update visit status');
      }
    } catch (error) {
      console.error('Error updating visit status:', error);
    }
  };

  const handleCheckout = (visit) => {
    setSelectedVisit(visit);
    setSignature("")
    setCode("")
    setShowModal(true);
  };

  const renderVisitItem = ({ item }) => (
    <View style={styles.visitItem}>
      <View style={styles.row}>
        <Text style={styles.visitText}>Visit Reference ID: {item.id}</Text>
        <Text
          style={[
            styles.visitStatus,
            {
              color:
                item.approve_status === 'Completed'
                  ? 'green'
                  : item.approve_status === 'CheckIn'
                  ? 'red'
                  : 'orange',
            },
          ]}
        >
          Status: {item.approve_status}
        </Text>
      </View>
      <View style={styles.row}> <Text style={styles.visitText}>Visitor Name: {item.visitor_name}</Text>
      <Text style={styles.visitText}>Phone: {item.visitor_phone}</Text></View>
      <View style={styles.row}>
        <Text style={styles.visitText}>Apartment: {item.destination_apartment}</Text>
       
      </View>
      <View style={styles.row}>
        {item.approve_status === 'CheckIn' && (
          <TouchableOpacity style={styles.checkoutButton} onPress={() => handleCheckout(item)}>
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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


  const pendingVisits = visits.filter((visit) => visit.approve_status === "Pending");
  const completedVisits = visits.filter((visit) => visit.approve_status === "Completed");
  const checkinVisits = visits.filter((visit) => visit.approve_status === "CheckIn");

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../components/assets/images/imgbg.jpeg')} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.userSection}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Hi {name}</Text>
            </View>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Image
              source={require('../components/assets/images/logout.png')}  // Update with the correct path to your logout image
              style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            <TouchableOpacity style={styles.notificationIcon}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/1827/1827311.png',
                }}
                style={styles.iconImage}
              />
            </TouchableOpacity>
          </View>

          {/* Weather Section */}
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

          {/* Visits Section */}
          <View style={styles.visitListSection}>
            <Text style={styles.sectionTitle}>Checked In Visits</Text>
            <FlatList
              data={checkinVisits}
              renderItem={renderVisitItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>No checked-in visits.</Text>}
            />
          </View>

          {/* Pending Visits Section */}
          <View style={styles.visitListSection}>
            <Text style={styles.sectionTitle}>Pending Visits</Text>
            <FlatList
              data={pendingVisits}
              renderItem={renderVisitItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>No pending visits.</Text>}
            />
          </View>

          {/* Completed Visits Section */}
          <View style={styles.visitListSection}>
            <Text style={styles.sectionTitle}>Completed Visits</Text>
            <FlatList
              data={completedVisits}
              renderItem={renderVisitItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text style={styles.emptyText}>No completed visits.</Text>}
            />
          </View>
        </ScrollView>
      </ImageBackground>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Code and Signature</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Code"
              value={code}
              onChangeText={setCode}
            />
            <TextInput
              style={styles.input}
              placeholder="Authorised By"
              value={signature}
              onChangeText={setSignature}
            />
            <TouchableOpacity style={styles.submitButton} onPress={updateVisitStatus}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E213A',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 3,
  },
  userDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFC300',
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
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
  weatherLocation: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  weatherDetails: {
    fontSize: 14,
    color: 'black',
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
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  visitText: {
    fontSize: 14,
  },
  visitStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#FFC300',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#FFC300',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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

export default DashboardScreenOwner;
