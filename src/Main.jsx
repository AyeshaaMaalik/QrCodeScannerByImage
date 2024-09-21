import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import jsQR from 'jsqr';
import { Buffer } from 'buffer'; // Import Buffer from the buffer package

const Main = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeData, setQRCodeData] = useState(null);

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets) {
          const imageUri = response.assets[0].uri;
          setSelectedImage(imageUri);

          const qrData = await scanQRCode(imageUri);
          setQRCodeData(qrData);
        }
      }
    );
  };

  const scanQRCode = async (imageUri) => {
    try {
      const imagePath = imageUri.replace('file://', '');
      const base64Image = await RNFS.readFile(imagePath, 'base64');
      const imageBuffer = Buffer.from(base64Image, 'base64'); // Use Buffer from buffer package

      const image = new Image();
      image.src = `data:image/png;base64,${base64Image}`;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode) {
        return qrCode.data; // QR Code data
      } else {
        Alert.alert('No QR code found');
        return null;
      }
    } catch (error) {
      console.log('QR Code decoding error: ', error);
      Alert.alert('Error', 'Unable to decode QR code');
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Scanner</Text>
      <Button title="Open Gallery" onPress={openGallery} color="#F9D689" />

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      )}

      {qrCodeData && (
        <View style={styles.qrCodeContainer}>
          <Text style={styles.qrCodeText}>QR Code Data: {qrCodeData}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#973131',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#F9D689',
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#F9D689',
    borderRadius: 10,
  },
  qrCodeContainer: {
    marginTop: 20,
  },
  qrCodeText: {
    fontSize: 18,
    color: '#F9D689',
  },
});

export default Main;
