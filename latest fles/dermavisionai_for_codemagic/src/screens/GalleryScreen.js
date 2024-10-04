import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';

const GalleryScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const directoryUri = `${FileSystem.documentDirectory}images/`;
        const fileInfo = await FileSystem.readDirectoryAsync(directoryUri);
        
        const imageFiles = fileInfo.map(file => `${directoryUri}${file}`);
        setImages(imageFiles);
      } catch (error) {
        console.error('Error fetching images from gallery:', error);
      }
    };

    fetchImages();
  }, []);

  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ImageDetail', { uri: item })}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      {images.length > 0 ? (
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={(item) => item}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <Text style={styles.noImagesText}>No images found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  noImagesText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#888',
  },
});

export default GalleryScreen;
