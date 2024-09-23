import React, { useState } from 'react';
import { View, Button, Text, Image, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNQRGenerator from 'rn-qr-generator';

const Main = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeData, setQRCodeData] = useState('');

  const pickImage = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (result && result[0]) {
        const fileUri = result[0].uri;
        setSelectedImage(fileUri);
        
        scanQRCode(fileUri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled');
      } else {
        console.error('Error picking the document: ', err);
      }
    }
  };

  const scanQRCode = (imageUri) => {
    RNQRGenerator.detect({ uri: imageUri })
      .then((response) => {
        const { values } = response;
        if (values.length > 0) {
          setQRCodeData(values[0]); 
          Alert.alert('QR Code Found', values[0]);
        } else {
          Alert.alert('No QR Code Found', 'No QR code was detected in the image.');
        }
      })
      .catch((error) => {
        console.log('QR code detection failed:', error);
        Alert.alert('Error', 'Could not scan the image for a QR code.');
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={pickImage} color="#FFD700" /> 
      
      {selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <Text style={styles.qrCodeText}>QR Code Data: {qrCodeData || 'N/A'}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', 
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderColor: '#FFD700', 
    borderWidth: 2,
  },
  qrCodeText: {
    marginTop: 10,
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Main;
