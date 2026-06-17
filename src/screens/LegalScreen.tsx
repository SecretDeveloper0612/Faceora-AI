import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight, Shield, FileText, Info } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const PREMIUM_DARK = '#2A2421';

export function LegalScreen() {
  const params = useLocalSearchParams();
  const [selectedDoc, setSelectedDoc] = useState<string | null>((params.type as string) || null);

  const renderContent = () => {
    switch (selectedDoc) {
      case 'privacy':
        return (
          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Privacy Policy</Text>
            <Text style={styles.documentText}>
              Last updated: October 2026{'\n\n'}
              At Faceora AI, we take your privacy seriously. This policy describes what personal information we collect and how we use it.{'\n\n'}
              1. Information Collection{'\n'}
              We collect your facial scans locally to process AI health metrics. None of this data is stored on our servers without explicit permission.{'\n\n'}
              2. Data Usage{'\n'}
              Your data is used solely to generate health and wellness reports.{'\n\n'}
              3. Security{'\n'}
              We use industry-standard encryption to protect any data transmitted to our premium AI coaching services.
            </Text>
          </View>
        );
      case 'terms':
        return (
          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Terms of Service</Text>
            <Text style={styles.documentText}>
              Last updated: October 2026{'\n\n'}
              Welcome to Faceora AI.{'\n\n'}
              By using our app, you agree to these terms. Faceora AI provides health estimations and should not be used as a replacement for professional medical advice.{'\n\n'}
              You must be at least 18 years old to use the Premium AI Coach features.{'\n\n'}
              Subscriptions are billed monthly or annually and can be canceled at any time through your app store settings.
            </Text>
          </View>
        );
      case 'about':
        return (
          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>About Faceora AI</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0 (Build 42)</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.aboutLabel}>Company</Text>
              <Text style={styles.aboutValue}>FaceHealth AI, Inc.</Text>
              
              <View style={styles.divider} />
              
              <Text style={styles.aboutLabel}>Contact</Text>
              <Text style={styles.aboutValue}>hello@faceora.ai</Text>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.listContainer}>
            <LegalItem 
              icon={<Shield size={24} color={PREMIUM_DARK} />} 
              title="Privacy Policy" 
              onPress={() => setSelectedDoc('privacy')} 
            />
            <View style={styles.divider} />
            <LegalItem 
              icon={<FileText size={24} color={PREMIUM_DARK} />} 
              title="Terms of Service" 
              onPress={() => setSelectedDoc('terms')} 
            />
            <View style={styles.divider} />
            <LegalItem 
              icon={<Info size={24} color={PREMIUM_DARK} />} 
              title="About Faceora AI" 
              onPress={() => setSelectedDoc('about')} 
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            onPress={() => {
              if (selectedDoc && !params.type) {
                setSelectedDoc(null);
              } else {
                router.back();
              }
            }} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={PREMIUM_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Legal & About</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function LegalItem({ icon, title, onPress }: { icon: React.ReactNode, title: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.legalItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <ChevronRight size={20} color="#A0958F" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IVORY_WHITE,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: PREMIUM_DARK,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(140, 119, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: PREMIUM_DARK,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  documentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: PREMIUM_DARK,
    marginBottom: 20,
  },
  documentText: {
    fontSize: 15,
    color: '#4A423D',
    lineHeight: 24,
  },
  aboutCard: {
    marginTop: 8,
  },
  aboutLabel: {
    fontSize: 12,
    color: '#6A5F58',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  aboutValue: {
    fontSize: 16,
    fontWeight: '600',
    color: PREMIUM_DARK,
    marginBottom: 16,
  }
});
