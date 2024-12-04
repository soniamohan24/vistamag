import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRScanner from './QRScanner';
const dWidth = Dimensions.get('window').width;

const colour = 'black';

const App = () => {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const openQRscanner = () => {
    setShowQR(true);
  };

  const onQrRead = qrtext => {
    if (qrtext !== null) {
      setQrCode(qrtext);
      ToastAndroid.show(qrtext, ToastAndroid.LONG);
    }
    setShowQR(false);
  };

  return (
    <SafeAreaView style={styles.page}>
      <Text
        style={{
          fontSize: dWidth * 0.1,
          color: 'black',
          fontWeight: 'bold',
          flex: 0.5,
        }}>
        VistaMag
      </Text>
      <TouchableOpacity onPress={() => openQRscanner()} style={styles.btn}>
        <Ionicons
          name={'scan-circle-outline'}
          size={qrCode ? dWidth * 0.4 : dWidth * 0.75}
          color={colour}
        />
      </TouchableOpacity>
      {showQR ? <QRScanner onRead={onQrRead} /> : null}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: colour,
  },
});
