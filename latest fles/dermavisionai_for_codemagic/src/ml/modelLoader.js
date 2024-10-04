import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// 1. Load the model
let model; 

export const loadModel = async () => {
  try {
    const modelJson = await bundleResourceIO(require('../assets/model_unquant.tflite')).load(); 
    model = await tflite.loadTFLiteModel(modelJson);
    console.log('Model loaded successfully!');
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load the machine learning model. Please try again later.'); 
  }
};

// 2. Preprocess the image
const preprocessImage = async (imageUri) => {
  try {
    const resizedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { format: 'jpeg' } 
    );

    const imgB64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const raw = new Uint8Array(imgBuffer);  

    const imageTensor = tf.tidy(() => {
      return tf.image.decodeJpeg(raw, 3).expandDims(0).toFloat().div(tf.scalar(255)); 
    });

    return imageTensor;

  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Failed to process the image. Please try again.'); 
  }
};

// 3. Make predictions
export const predictImage = async (imageUri) => {
  try {
    if (!model) {
      throw new Error('Model not loaded yet. Please wait.');
    }

    const imageTensor = await preprocessImage(imageUri); 
    const outputTensor = await model.predict(imageTensor);

    const predictions = await outputTensor.data();
    const predictedClassIndex = predictions.indexOf(Math.max(...predictions));

    const classNames = ['Acne', 'Psoriasis', 'Chickenpox', 'Blister', 'Melanoma', 'Eczema']; 

    const classProbabilities = {};

    for (let i = 0; i < classNames.length; i++) {
      classProbabilities[classNames[i]] = (predictions[i] * 100).toFixed(2) + '%'; 
    }

    imageTensor.dispose();
    outputTensor.dispose();

    return {
      predictedClass: classNames[predictedClassIndex],
      probabilities: classProbabilities
    };

  } catch (error) {
    console.error('Error predicting image:', error);
    throw error; 
  }
};