import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Linking } from 'react-native';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';
import { ProgressBar, MD3Colors } from 'react-native-paper';
import { saveAnalysisToFirestore } from '../services/FirestoreService'; 

const ResultsScreen = ({ route, navigation }) => {
  const { prediction, imageUri } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const getSeverityLevel = (className) => {
    switch (className) {
      case 'Melanoma': 
        return 'High'; 
      case 'Blister':
      case 'Eczema':
        return 'Medium';
      default:
        return 'Low'; 
    }
  };

  const conditionExplanations = {
    'Acne': {
      explanation: 'A common skin condition that causes pimples, blackheads, and whiteheads.',
      link: 'https://www.aad.org/public/diseases/acne',
      recommendations: [
        'Wash your face twice a day with a gentle cleanser.',
        'Avoid touching or picking at your skin.',
        'Use oil-free and non-comedogenic skincare products.',
        'Consider consulting a dermatologist for personalized treatment options.',
      ],
    },
    'Psoriasis': {
      explanation: 'A chronic autoimmune disease that causes raised, red, scaly patches on the skin.',
      link: 'https://www.psoriasis.org/',
      recommendations: [
        'Moisturize your skin regularly.',
        'Avoid triggers like stress and skin injuries.',
        'Consider topical medications or light therapy as recommended by your doctor.',
      ],
    },
    'Chickenpox': {
      explanation: 'A highly contagious viral infection causing an itchy, blister-like rash.',
      link: 'https://www.cdc.gov/chickenpox/index.html',
      recommendations: [
        'Avoid scratching the blisters to prevent scarring.',
        'Take over-the-counter pain relievers for fever and discomfort.',
        'Consult a doctor if you experience severe symptoms or complications.',
      ],
    },
    'Blister': {
      explanation: 'A small pocket of fluid within the upper layers of the skin, typically caused by friction, burns, or infections.',
      link: 'https://www.healthline.com/health/blisters',
      recommendations: [
        'Keep the blister clean and dry.',
        'Avoid popping the blister unless it\'s large or painful.',
        'Cover the blister with a bandage to protect it from further irritation.',
      ],
    },
    'Melanoma': {
      explanation: 'The most serious type of skin cancer, often developing from a mole or other pigmented area.',
      link: 'https://www.cancer.org/cancer/melanoma-skin-cancer.html',
      recommendations: [
        'Consult a dermatologist immediately for further evaluation and treatment.',
        'Avoid sun exposure and use sunscreen regularly.',
        'Perform regular skin self-exams to detect any changes in moles or other skin lesions.',
      ],
    },
    'Eczema': {
      explanation: 'A group of conditions that cause the skin to become red, itchy, and inflamed.',
      link: 'https://www.nationaleczema.org/',
      recommendations: [
        'Moisturize your skin frequently.',
        'Avoid triggers like harsh soaps and irritants.',
        'Use prescribed medications or topical creams as directed by your doctor.',
      ],
    },
  };
  
  const saveToHistory = async () => {
    try {
      await saveAnalysisToFirestore({ prediction, imageUri });
      Alert.alert('Success', 'Analysis saved to history.');
    } catch (err) {
      console.error('Error saving analysis:', err);
      Alert.alert('Error', 'Failed to save analysis.');
    }
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

  if (!prediction || Object.keys(prediction).length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No analysis results available.</Text>
      </View>
    );
  }

  const predictedClass = prediction.predictedClass;
  const { explanation, link, recommendations } = conditionExplanations[predictedClass] || {};

  return (
    <ScrollView style={styles.container} accessibilityLabel="Analysis Results Screen">
      <Image source={{ uri: imageUri }} style={styles.image} accessibilityLabel="Analyzed Image" />

      <View style={styles.resultContainer}>
        <Text style={styles.title}>Analysis Results</Text>

        <View style={styles.topPredictionContainer}>
          <Text style={styles.topPredictionLabel}>Most Likely Condition:</Text>
          <Text style={[styles.topPredictionValue, { color: colors.primary }]}>
            {predictedClass}
          </Text>
          <ProgressBar
            progress={prediction.probabilities[predictedClass] / 100}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.probabilityText}>
            Confidence: {prediction.probabilities[predictedClass]}
          </Text>
          <Text style={styles.severityText}>
            Severity: {getSeverityLevel(predictedClass)}
          </Text>

          {/* Explanation and link for more information */}
          {explanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationText}>{explanation}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(link)}>
                <Text style={styles.learnMoreLink}>Learn more about {predictedClass}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Recommendations */}
          {recommendations && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Recommendations:</Text>
              {recommendations.map((recommendation, index) => (
                <Text key={index} style={styles.recommendationItem}>
                  - {recommendation}
                </Text>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.otherProbabilitiesLabel}>Other Possibilities:</Text>
        {Object.entries(prediction.probabilities)
          .filter(([className]) => className !== predictedClass)
          .map(([className, probability]) => (
            <View key={className} style={styles.resultItem}>
              <Text style={styles.resultLabel}>{className}:</Text>
              <Text style={styles.resultValue}>{probability}</Text>
              <ProgressBar
                progress={parseFloat(probability) / 100}
                color={colors.secondary}
                style={styles.progressBar}
              />
            </View>
          ))}

        {/* Save to History Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveToHistory}
        >
          <Text style={styles.saveButtonText}>Save to History</Text>
        </TouchableOpacity>

        {/* Learn More Button (You can keep this if you want a general 'Learn More' option) */}
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => navigation.navigate('Education')}
        >
          <Text style={styles.learnMoreButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... your existing styles
  topPredictionContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  topPredictionLabel: {
    fontSize: 18,
  },
  topPredictionValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  probabilityText: {
    fontSize: 16,
  },
  severityText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  explanationContainer: {
    marginTop: 10,
  },
  explanationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  learnMoreLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  otherProbabilitiesLabel: {
    fontSize: 18,
    marginTop: 20,
},
resultItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},
resultLabel: {
  fontSize: 16,
},
resultValue: {
  fontSize: 16,
  fontWeight: 'bold',
},
saveButton: {
  marginTop: 20,
  backgroundColor: colors.primary,
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
},
saveButtonText: {
  color: 'white',
  fontSize: 16,
},
learnMoreButton: {
  marginTop: 20,
  backgroundColor: colors.secondary,
  padding: 10,
  borderRadius: 5,
  alignItems: 'center',
},
learnMoreButtonText: {
  color: 'white',
  fontSize: 16,
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
recommendationsContainer: {
  marginTop: 20,
},
recommendationsTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
},
recommendationItem: {
  fontSize: 16,
  marginBottom: 5,
},
});

export default ResultsScreen;