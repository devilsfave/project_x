import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off); // State for flash
  const [type, setType] = useState(Camera.Constants.Type.back); // State for camera type
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');

        await tf.ready();
        const modelJson = await bundleResourceIO(require('../assets/final_trained_model.tflite')).load();
        const tfliteModel = await tflite.loadTFLiteModel(modelJson);
        setModel(tfliteModel);
      } catch (error) {
        console.error('Error initializing camera or loading model:', error);
      }
    })();
  }, []);

  const captureImage = async () => {
    if (cameraRef.current && model) {
      try {
        setIsLoading(true);
        
        // Create directory to save images
        const directoryUri = `${FileSystem.documentDirectory}images/`;
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });

        // Capture the image
        const photo = await cameraRef.current.takePictureAsync({ flashMode });
        
        // Save the image to the directory
        const imageUri = `${directoryUri}${Date.now()}.jpg`; // Use timestamp for a unique filename
        await FileSystem.moveAsync({
          from: photo.uri,
          to: imageUri,
        });

        // Resize the image
        const resizedPhoto = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 224, height: 224 } }],
          { format: 'png' }
        );

        // Read and preprocess the image
        const imgB64 = await FileSystem.readAsStringAsync(resizedPhoto.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
        const raw = new Uint8Array(imgBuffer);

        const imageTensor = tf.tidy(() => {
          const decodedImage = tf.image.decodeJpeg(raw, 3);
          return tf.expandDims(decodedImage);
        });

        // Run inference
        const outputTensor = await model.predict(imageTensor);
        const outputData = await outputTensor.data();

        // Clean up tensors
        imageTensor.dispose();
        outputTensor.dispose();

        setIsLoading(false);

        // Navigate to ResultsScreen
        navigation.navigate('Results', { output: outputData, imageUri: imageUri }); // Use the new imageUri
      } catch (error) {
        console.error('Error capturing or processing image:', error);
        setIsLoading(false);
      }
    }
  };

  const toggleFlash = () => {
    setFlashMode(prevMode => 
      prevMode === Camera.Constants.FlashMode.off 
      ? Camera.Constants.FlashMode.on 
      : Camera.Constants.FlashMode.off
    );
  };

  const switchCamera = () => {
    setType(prevType => 
      prevType === Camera.Constants.Type.back 
      ? Camera.Constants.Type.front 
      : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={type} flashMode={flashMode} /> {/* Display camera preview */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={captureImage}
          disabled={isLoading} // Disable button while loading
          accessibilityLabel="Capture Image Button"
        >
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={toggleFlash}
          accessibilityLabel="Toggle Flash Button"
        >
          <Text style={styles.buttonText}>{flashMode === Camera.Constants.FlashMode.off ? 'Flash On' : 'Flash Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={switchCamera}
          accessibilityLabel="Switch Camera Button"
        >
          <Text style={styles.buttonText}>Switch Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Gallery')}
          accessibilityLabel="Open Gallery Button"
        >
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: '#6200EE',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CameraScreen;
