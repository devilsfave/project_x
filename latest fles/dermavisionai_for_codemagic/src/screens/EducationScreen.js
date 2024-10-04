import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, TextInput, FlatList, 
  Linking 
} from 'react-native';
import { colors } from '../styles/colors';
import { responsive } from '../styles/responsive';

const educationContent = [
  // Acne and Rosacea
  {
    title: "Understanding Acne: Causes, Types, and Treatments",
    content: "Acne is a common skin condition that affects millions of people worldwide...",
    link: "https://www.aad.org/public/diseases/acne"
  },
  {
    title: "Rosacea: More Than Just Redness",
    content: "Rosacea is a chronic skin condition that causes redness and visible blood vessels in your face...",
    link: "https://www.mayoclinic.org/diseases-conditions/rosacea/symptoms-causes/syc-20353815"
  },
  // Eczema
  {
    title: "Eczema (Atopic Dermatitis): Symptoms, Causes, and Treatment",
    content: "Eczema is a condition where patches of skin become inflamed, itchy, red, cracked, and rough...",
    link: "https://www.nationalezcema.org/eczema/"
  },
  {
    title: "Managing Eczema Flare-Ups",
    content: "Flare-ups of eczema can be triggered by a variety of factors. Learn how to manage them effectively...",
    link: "https://www.webmd.com/skin-problems-and-treatments/eczema/eczema-flare-ups"
  },
  // Psoriasis
  {
    title: "Psoriasis: Causes, Symptoms, and Treatment Options",
    content: "Psoriasis is a chronic autoimmune condition that causes the rapid buildup of skin cells...",
    link: "https://www.psoriasis.org/about-psoriasis"
  },
  {
    title: "Living with Psoriasis: Tips and Strategies",
    content: "Living with psoriasis can be challenging, but these tips can help you manage the condition...",
    link: "https://www.healthline.com/health/psoriasis/living-with-psoriasis"
  },
  // Skin Cancer
  {
    title: "Skin Cancer: Types, Risks, and Prevention",
    content: "Skin cancer is the most common form of cancer in the world. Learn about its types and prevention...",
    link: "https://www.cancer.org/cancer/skin-cancer.html"
  },
  {
    title: "How to Perform a Skin Self-Exam",
    content: "Early detection of skin cancer can save lives. Learn how to perform a self-exam...",
    link: "https://www.skincancer.org/early-detection/self-exams"
  },
  // Vitiligo
  {
    title: "Vitiligo: Understanding the Condition and Treatment Options",
    content: "Vitiligo is a condition in which the skin loses its pigment cells. Discover the treatment options...",
    link: "https://www.mayoclinic.org/diseases-conditions/vitiligo/symptoms-causes/syc-20355912"
  },
  {
    title: "Living with Vitiligo: Coping and Support",
    content: "Coping with vitiligo can be difficult. Learn about the support available to help manage the condition...",
    link: "https://www.aad.org/public/diseases/a-z/vitiligo-skin"
  },
  // Fungal Infections
  {
    title: "Fungal Skin Infections: Types and Treatments",
    content: "Fungal infections can affect many parts of the body, including the skin. Learn about the types and treatments...",
    link: "https://www.webmd.com/skin-problems-and-treatments/guide/fungal-infections-skin"
  },
  {
    title: "Ringworm: Symptoms, Causes, and Treatment",
    content: "Ringworm is a common fungal infection that causes a ring-shaped rash. Discover how to treat it...",
    link: "https://www.cdc.gov/fungal/diseases/ringworm/index.html"
  },
  // Dermatitis
  {
    title: "Contact Dermatitis: Causes and Treatments",
    content: "Contact dermatitis is a type of inflammation of the skin that results from contact with certain substances...",
    link: "https://www.mayoclinic.org/diseases-conditions/contact-dermatitis/symptoms-causes/syc-20352723"
  },
  {
    title: "Seborrheic Dermatitis: Symptoms and Care",
    content: "Seborrheic dermatitis is a common skin condition that mainly affects your scalp. Learn how to manage it...",
    link: "https://www.webmd.com/skin-problems-and-treatments/seborrheic-dermatitis-medref"
  }
  
];

const EducationScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
  
    const filteredContent = educationContent.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const renderItem = ({ item }) => (
      <TouchableOpacity 
        key={item.title} 
        style={styles.topicContainer}
        onPress={() => Linking.openURL(item.link)} // Open external link
      >
        <Text style={styles.topicTitle}>{item.title}</Text>
        <Text style={styles.topicPreview}>{item.content.substring(0, 80)}...</Text> 
      </TouchableOpacity>
    );
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Educational Resources</Text>
  
        <TextInput
          placeholder="Search..." 
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
  
        <FlatList
          data={filteredContent}
          renderItem={renderItem}
          keyExtractor={(item) => item.title} 
          contentContainerStyle={styles.listContent} 
        />
  
        {/* Navigation Buttons */}
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('TermsOfService')}>
          <Text style={styles.linkButtonText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('PrivacyPolicy')}>
          <Text style={styles.linkButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: responsive(20),
    },
    title: {
      fontSize: responsive(24),
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: responsive(20),
    },
    topicContainer: {
      backgroundColor: colors.white,
      borderRadius: responsive(10),
      padding: responsive(15),
      marginBottom: responsive(15),
    },
    topicTitle: {
      fontSize: responsive(18),
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: responsive(5),
    },
    topicPreview: {
      fontSize: responsive(14),
      color: colors.text,
    },
    searchInput: {
      marginBottom: responsive(20),
      backgroundColor: colors.white,
      padding: responsive(10),
      borderRadius: responsive(10),
    },
    linkButton: {
      marginTop: 20,
      padding: 10,
    },
    linkButtonText: {
      color: '#007AFF',
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
  });
  
  export default EducationScreen;