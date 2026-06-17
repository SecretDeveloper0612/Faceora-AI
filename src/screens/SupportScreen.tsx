import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MessageCircle, HelpCircle, Bug, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const PREMIUM_DARK = '#2A2421';

export function SupportScreen() {
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={PREMIUM_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.supportGroup}>
            <SupportItem 
              icon={<HelpCircle size={24} color={PREMIUM_DARK} />} 
              title="FAQ" 
              subtitle="Find answers to common questions"
              onPress={() => {}} 
            />
            <View style={styles.divider} />
            <SupportItem 
              icon={<MessageCircle size={24} color={PREMIUM_DARK} />} 
              title="Contact Support" 
              subtitle="Chat with our support team"
              onPress={() => {}} 
            />
            <View style={styles.divider} />
            <SupportItem 
              icon={<Bug size={24} color={PREMIUM_DARK} />} 
              title="Report Bug" 
              subtitle="Help us improve FaceHealAI"
              onPress={() => {}} 
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SupportItem({ icon, title, subtitle, onPress }: { icon: React.ReactNode, title: string, subtitle: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.supportItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
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
  supportGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
  },
  supportItem: {
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
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: PREMIUM_DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6A5F58',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  }
});
