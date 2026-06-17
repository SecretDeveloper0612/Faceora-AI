import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  interpolateColor,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ShieldCheck, CheckCircle2, ArrowLeft, Frown, Coffee, Smile, Moon } from 'lucide-react-native';
import { router } from 'expo-router';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#DCC7BC'; 

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SLEEP_HOURS_LEVELS = [
  { id: 'less_than_5', title: 'Less than 5 hours', icon: Frown },
  { id: '5_to_6', title: '5 - 6 hours', icon: Coffee },
  { id: '6_to_8', title: '6 - 8 hours', icon: Smile },
  { id: 'more_than_8', title: '8+ hours', icon: Moon },
];

function SleepCard({ item, isSelected, onPress, delay }: { item: any, isSelected: boolean, onPress: () => void, delay: number }) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const selectedProgress = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15 }));
  }, []);

  useEffect(() => {
    selectedProgress.value = withTiming(isSelected ? 1 : 0, { duration: 300 });
  }, [isSelected]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { scale: interpolate(selectedProgress.value, [0, 1], [1, 1.02]) }
    ],
    borderColor: interpolateColor(selectedProgress.value, [0, 1], ['rgba(255, 255, 255, 0.4)', 'rgba(140, 119, 107, 0.6)']),
    backgroundColor: interpolateColor(selectedProgress.value, [0, 1], ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.8)']),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
    transform: [{ scale: selectedProgress.value }]
  }));

  const IconComponent = item.icon;

  return (
    <AnimatedTouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, style]}>
      <View style={{ marginRight: 16 }}>
        <IconComponent size={26} color="#2A2421" strokeWidth={1.5} />
      </View>
      <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{item.title}</Text>
      <Animated.View style={[styles.checkContainer, checkStyle]}>
        <CheckCircle2 size={20} color="#8C776B" />
      </Animated.View>
    </AnimatedTouchableOpacity>
  );
}

export function SleepHoursInputScreen({ onContinue }: { onContinue?: (hours: string) => void }) {
  const [selectedHours, setSelectedHours] = useState<string | null>(null);
  
  // Shared values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const logoFloat = useSharedValue(0);
  const scanPulse = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  const feedbackOpacity = useSharedValue(0);
  const feedbackTranslateY = useSharedValue(10);
  const buttonBreathe = useSharedValue(1);
  const progressWidth = useSharedValue(63);

  useEffect(() => {
    // Entrance Animations
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    ctaOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
    ctaTranslateY.value = withDelay(1200, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    progressWidth.value = withDelay(300, withTiming(70, { duration: 1000, easing: Easing.out(Easing.exp) }));

    logoFloat.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(5, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    scanPulse.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.out(Easing.cubic) }),
      -1,
      false
    );

    buttonBreathe.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (selectedHours) {
      feedbackOpacity.value = withTiming(1, { duration: 500 });
      feedbackTranslateY.value = withSpring(0, { damping: 12 });
    }
  }, [selectedHours]);

  const logoEntranceStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }, { translateY: logoFloat.value }]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scanPulse.value, [0, 1], [0.8, 2]) }],
    opacity: interpolate(scanPulse.value, [0, 0.8, 1], [0.5, 0, 0]),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }]
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }]
  }));

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
    transform: [{ translateY: feedbackTranslateY.value }]
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectedHours ? buttonBreathe.value : 1 }]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }));

  const particles = Array.from({ length: 12 }).map((_, i) => ({
    top: `${(Math.sin(i * 321) * 0.5 + 0.5) * 100}%` as DimensionValue,
    left: `${(Math.cos(i * 123) * 0.5 + 0.5) * 100}%` as DimensionValue,
    size: (Math.sin(i * 213) * 0.5 + 0.5) * 5 + 2,
    opacity: (Math.sin(i * 312) * 0.5 + 0.5) * 0.5 + 0.1,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, WARM_NUDE]} style={StyleSheet.absoluteFill} />
      
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {particles.map((p, i) => (
          <View key={i} style={[styles.particle, { top: p.top, left: p.left, width: p.size, height: p.size, opacity: p.opacity }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        
        <OnboardingHeader progressStyle={progressStyle} />



        <Animated.View style={[styles.contentSection, contentStyle]}>
          <Text style={styles.headline}>How many hours do you sleep?</Text>
          <Text style={styles.subheadline}>Quality sleep helps skin repair and reduces puffiness.</Text>
          
          <View style={styles.cardsContainer}>
            {SLEEP_HOURS_LEVELS.map((level, index) => (
              <SleepCard 
                key={level.id}
                item={level}
                isSelected={selectedHours === level.id} 
                onPress={() => setSelectedHours(level.id)} 
                delay={600 + (index * 100)} 
              />
            ))}
          </View>

          <Animated.View style={[styles.feedbackContainer, feedbackStyle]}>
            <Text style={styles.feedbackText}>Sleep is the ultimate skincare. We&apos;ll use this info.</Text>
          </Animated.View>

        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <Animated.View style={[styles.primaryButton, buttonStyle, !selectedHours && styles.primaryButtonDisabled]}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill}
              activeOpacity={0.8}
              disabled={!selectedHours}
              onPress={() => {
                if (selectedHours) onContinue?.(selectedHours);
              }}
            >
              <LinearGradient
                colors={selectedHours ? ['#8C776B', '#635147'] : ['rgba(140, 119, 107, 0.4)', 'rgba(99, 81, 71, 0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={[styles.primaryButtonText, !selectedHours && styles.primaryButtonTextDisabled]}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  safeArea: { flex: 1 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 16, marginBottom: 12,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  particle: {
    position: 'absolute', backgroundColor: '#FFF', borderRadius: 10,
    shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
  },
  topSection: { alignItems: 'center', marginTop: 0, marginBottom: 12 },
  logoWrapper: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute', width: 64, height: 64, borderRadius: 32,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoBackgroundGlow: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 20,
  },
  logo: { width: 40, height: 40, zIndex: 2 },
  contentSection: { alignItems: 'center', paddingHorizontal: 24, flex: 1, width: '100%', paddingTop: 32 },
  headline: {
    fontSize: 26, fontWeight: '600', color: '#2A2421', textAlign: 'center',
    marginBottom: 6, letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 15, fontWeight: '400', color: '#6A5F58', textAlign: 'center',
    lineHeight: 22, paddingHorizontal: 8, marginBottom: 24,
  },
  cardsContainer: { width: '100%', gap: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    borderRadius: 24, borderWidth: 1,
    height: 76,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02, shadowRadius: 8,
  },
  cardIcon: { fontSize: 26, marginRight: 16 },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: '600', color: '#3A302B' },
  cardTitleSelected: { fontWeight: '600', color: '#2A2421' },
  checkContainer: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  feedbackContainer: {
    marginTop: 24, backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  feedbackText: { fontSize: 13, color: '#5A4C44', fontWeight: '500', textAlign: 'center' },
  spacer: { flex: 1 },
  ctaSection: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  primaryButton: {
    width: width - 48, height: 60, borderRadius: 30, shadowColor: '#5C4A41',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, marginBottom: 16,
  },
  primaryButtonDisabled: { shadowOpacity: 0 },
  primaryButtonGradient: {
    width: '100%', height: '100%', borderRadius: 30, alignItems: 'center', justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  primaryButtonTextDisabled: { color: 'rgba(255, 255, 255, 0.6)' },
});
