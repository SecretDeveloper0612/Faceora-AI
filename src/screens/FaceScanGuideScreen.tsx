import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ArrowRight, Glasses, Sun, Meh, ScanFace } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { SupabaseService } from '../services/SupabaseService';

const IVORY_WHITE = '#F8F6F4';
const BRAND_BROWN = '#2A2421';
const MUTED_BROWN = '#8A7A71';

export function FaceScanGuideScreen() {
  const user = useSelector((state: RootState) => state.user);
  const [isChecking, setIsChecking] = useState(false);

  const handleContinue = async () => {
    if (!user.isPremium && user.id) {
      setIsChecking(true);
      try {
        const lastPlanDate = await SupabaseService.getLatestPlanDate(user.id);
        if (lastPlanDate) {
          const daysSinceLastPlan = (Date.now() - new Date(lastPlanDate).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceLastPlan < 7) {
            setIsChecking(false);
            Alert.alert(
              'Premium Limit Reached',
              'Free users can only generate one Faceora AI Transformation Plan per week. Upgrade to Premium for unlimited plans and weekly progress tracking!',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Upgrade', onPress: () => router.push('/subscription') }
              ]
            );
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to check plan limit:', err);
      }
      setIsChecking(false);
    }
    router.push('/multi-angle-scan');
  };

  const instructions = [
    {
      id: '1',
      icon: <Glasses size={28} color={BRAND_BROWN} />,
      title: 'Remove glasses',
      description: 'Ensure your eyes and face are fully visible.',
    },
    {
      id: '2',
      icon: <Sun size={28} color={BRAND_BROWN} />,
      title: 'Use natural light',
      description: 'Face a window or ensure even lighting without harsh shadows.',
    },
    {
      id: '3',
      icon: <Meh size={28} color={BRAND_BROWN} />,
      title: 'Keep neutral expression',
      description: 'Relax your face to get the most accurate AI analysis.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[IVORY_WHITE, '#E8DDD6']} style={StyleSheet.absoluteFill} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={BRAND_BROWN} />
        </TouchableOpacity>

      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(600).springify()}>
          <View style={styles.iconCircle}>
            <ScanFace size={40} color={BRAND_BROWN} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>Face Scan Guide</Text>
          <Text style={styles.subtitle}>
            For the most accurate AI skin analysis, please follow these simple steps before we begin.
          </Text>
        </Animated.View>

        <View style={styles.instructionList}>
          {instructions.map((item, index) => (
            <Animated.View 
              key={item.id} 
              style={styles.instructionCard}
              entering={FadeInDown.delay(index * 150 + 200).duration(600).springify()}
            >
              <View style={styles.cardIconBox}>
                {item.icon}
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      <Animated.View style={styles.footer} entering={FadeIn.delay(800).duration(500)}>
        <TouchableOpacity activeOpacity={0.8} style={styles.continueButton} onPress={handleContinue} disabled={isChecking}>
          <LinearGradient 
            colors={['#8C776B', '#635147']} 
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
            style={StyleSheet.absoluteFill} 
          />
          {isChecking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.continueButtonText}>I&apos;m Ready</Text>
              <ArrowRight size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#5C4A41', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05, shadowRadius: 16,
  },
  title: {
    fontSize: 32, fontWeight: '700', color: BRAND_BROWN,
    letterSpacing: -0.5, marginBottom: 12,
  },
  subtitle: {
    fontSize: 16, fontWeight: '400', color: MUTED_BROWN,
    lineHeight: 24, marginBottom: 40,
  },
  
  instructionList: { gap: 16 },
  instructionCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: 16, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  cardIconBox: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03, shadowRadius: 8,
  },
  cardTextContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: BRAND_BROWN, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: MUTED_BROWN, lineHeight: 20 },
  
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#5C4A41', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16,
  },
  continueButtonText: {
    fontSize: 16, fontWeight: '600', color: '#FFF',
    marginRight: 8,
  },
});
