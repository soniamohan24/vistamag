import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView, ToastAndroid, PermissionsAndroid, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRScanner from './QRScanner'; // Assuming QRScanner is another component

const dWidth = Dimensions.get('window').width;

const MainScreen = () => {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');

  // Request camera permission at runtime
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera for scanning QR codes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          return true;
        } else {
          console.log('Camera permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      // iOS handles permissions automatically, so you may not need to do anything
      return true;
    }
  };

  // Open the QR scanner after checking permission
  const openQRscanner = async () => {
    const permissionGranted = await requestCameraPermission();
    if (permissionGranted) {
      setShowQR(true); // Proceed to open the QR scanner
    } else {
      ToastAndroid.show('Camera permission is required to scan QR codes', ToastAndroid.SHORT);
    }
  };

  const onQrRead = (qrtext) => {
    if (qrtext !== null) {
      setQrCode(qrtext);
      console.log(qrtext); // Handle the QR code data here
    }
    setShowQR(false);
  };
  useEffect(() => {
    if (route.params?.returnedMessage) {
      setMessage(route.params.returnedMessage);  // Set the returned data
    }
  }, [route.params]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>VistaMag</Text>
      <TouchableOpacity onPress={openQRscanner} style={styles.btn}>
        <Ionicons
          name={'scan-circle-outline'}
          size={qrCode ? dWidth * 0.4 : dWidth * 0.75}
          color="black"
        />
      </TouchableOpacity>
      {showQR ? <QRScanner onRead={onQrRead} /> : null}
    </SafeAreaView>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: dWidth * 0.1,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  btn: {
    alignItems: 'center',
  },
});
