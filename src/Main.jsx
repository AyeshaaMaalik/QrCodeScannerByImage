import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Main = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const fadeAnim = useSharedValue(0);

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets) {
          setSelectedImage(response.assets[0].uri);
          fadeIn(); 
        }
      }
    );
  };

  const fadeIn = () => {
    fadeAnim.value = withTiming(1, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Picker</Text>
      <Button title="Open Gallery" onPress={openGallery} color="#F9D689" />
      {selectedImage && (
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </Animated.View>
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
});

export default Main;
