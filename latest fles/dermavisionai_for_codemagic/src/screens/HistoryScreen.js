import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Image, FlatList, 
  TouchableOpacity, Alert, ActivityIndicator, Button 
} from 'react-native';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';
import { useAuth } from '../context/AuthContext';
import { loadAnalysisHistoryFromFirestore, deleteAnalysisFromFirestore, deleteAllAnalysesFromFirestore } from '../services/FirestoreService'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    } else {
      loadHistory();
    }
  }, [user, navigation]);

  const loadHistory = async () => {
    try {
      const historyData = await loadAnalysisHistoryFromFirestore();
      setHistory(historyData);
    } catch (err) {
      setError('Error loading analysis history from Firestore.');
      console.error('Error loading history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteAnalysisFromFirestore(itemId); 
      setHistory(history.filter(historyItem => historyItem.id !== itemId));
      Alert.alert('Success', 'Analysis deleted from history.');
    } catch (err) {
      console.error('Error deleting analysis:', err);
      Alert.alert('Error', 'Failed to delete analysis from history.');
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all your analysis history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteAllAnalysesFromFirestore();
              setHistory([]);
              Alert.alert('Success', 'All analyses deleted from history.');
            } catch (err) {
              console.error('Error clearing history:', err);
              Alert.alert('Error', 'Failed to clear analysis history.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    // Get the top 3 predictions
    const topPredictions = Object.entries(item.prediction.probabilities)
      .sort((a, b) => b[1] - a[1]) // Sort by probability in descending order
      .slice(0, 3) // Take the top 3
      .map(([className, probability]) => `${className}: ${probability}`)
      .join(', '); 

    return (
      <View style={styles.historyItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Results', { prediction: item.prediction, imageUri: item.imageUri })}
          accessibilityLabel={`Analysis from ${item.date}`}
          style={styles.historyItemContent}
        >
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} accessibilityLabel="Analysis Image Thumbnail" />
          <View style={styles.itemDetails}>
            <Text style={styles.date} accessibilityLabel="Analysis Date">
              {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.topPrediction} accessibilityLabel="Top Predictions">
              {topPredictions}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Icon name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No past analyses found. Start scanning your skin today!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analysis History</Text>

      {history.length > 0 && (
        <Button title="Clear All History" onPress={handleClearAll} color={colors.secondary} />
      )}

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
      />

      {/* Additional buttons for navigation */}
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('TermsOfService')}>
        <Text style={styles.linkButtonText}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <Text style={styles.linkButtonText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: responsive(20),
    backgroundColor: colors.background,
  },
  title: {
    fontSize: responsive(24),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: responsive(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
  },
  listContent: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20,
    backgroundColor: 'white', 
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, 
  },
  thumbnail: {
    width: responsive(80),
    height: responsive(80),
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    padding: responsive(10),
  },
  date: {
    fontSize: responsive(14),
    color: 'gray',
  },
  topPrediction: {
    fontSize: responsive(16),
    fontWeight: 'bold',
    marginTop: 5,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
  },
  deleteButton: {
    padding: 10,
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
  },
  linkButtonText: {
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default HistoryScreen;
