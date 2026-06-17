import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, DimensionValue, ScrollView } from 'react-native';
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
import { ShieldCheck, Check, ArrowLeft, Sparkles, Droplets, Sun, Target, TrendingDown, Hourglass, Scale } from 'lucide-react-native';
import { router } from 'expo-router';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#DCC7BC';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const GOALS = [
  { id: 'better_skin', label: 'Better Skin', icon: Sparkles },
  { id: 'reduce_acne', label: 'Reduce Acne', icon: Droplets },
  { id: 'glow_up', label: 'Glow Up', icon: Sun },
  { id: 'sharper_jawline', label: 'Sharper Jawline', icon: Target },
  { id: 'reduce_face_fat', label: 'Reduce Face Fat', icon: TrendingDown },
  { id: 'anti_aging', label: 'Anti Aging', icon: Hourglass },
  { id: 'better_symmetry', label: 'Better Symmetry', icon: Scale },
];

function GoalCard({ item, isSelected, onPress, delay }: { item: any, isSelected: boolean, onPress: () => void, delay: number }) {
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
    borderColor: interpolateColor(selectedProgress.value, [0, 1], ['rgba(255, 255, 255, 0.6)', 'rgba(140, 119, 107, 0.6)']),
    backgroundColor: interpolateColor(selectedProgress.value, [0, 1], ['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.8)']),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: selectedProgress.value,
    transform: [{ scale: selectedProgress.value }]
  }));

  const IconComponent = item.icon;

  return (
    <AnimatedTouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, style]}>
      <View style={styles.iconContainer}>
        <IconComponent size={22} color="#2A2421" strokeWidth={1.5} />
      </View>
      <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>{item.label}</Text>
      <Animated.View style={[styles.checkContainer, checkStyle]}>
        <Check size={16} color="#8C776B" strokeWidth={3} />
      </Animated.View>
    </AnimatedTouchableOpacity>
  );
}

export function GoalsInputScreen({ onContinue }: { onContinue?: (goals: string[]) => void }) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
  // Shared values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const logoFloat = useSharedValue(0);
  const scanPulse = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  const buttonBreathe = useSharedValue(1);
  const progressWidth = useSharedValue(35);

  useEffect(() => {
    // Entrance Animations
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    ctaOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
    ctaTranslateY.value = withDelay(1200, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    progressWidth.value = withDelay(300, withTiming(42, { duration: 1000, easing: Easing.out(Easing.exp) }));

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

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

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

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectedGoals.length > 0 ? buttonBreathe.value : 1 }]
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
          <Text style={styles.headline}>What do you want to improve?</Text>
          <Text style={styles.subheadline}>Select all that apply.</Text>
          
          <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {GOALS.map((goal, index) => (
                <View key={goal.id} style={styles.gridItem}>
                  <GoalCard 
                    item={goal}
                    isSelected={selectedGoals.includes(goal.id)} 
                    onPress={() => toggleGoal(goal.id)} 
                    delay={600 + (index * 50)} 
                  />
                </View>
              ))}
            </View>
          </ScrollView>

        </Animated.View>

        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <Animated.View style={[styles.primaryButton, buttonStyle, selectedGoals.length === 0 && styles.primaryButtonDisabled]}>
            <TouchableOpacity 
              style={StyleSheet.absoluteFill}
              activeOpacity={0.8}
              disabled={selectedGoals.length === 0}
              onPress={() => {
                if (selectedGoals.length > 0) onContinue?.(selectedGoals);
              }}
            >
              <LinearGradient
                colors={selectedGoals.length > 0 ? ['#8C776B', '#635147'] : ['rgba(140, 119, 107, 0.4)', 'rgba(99, 81, 71, 0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={[styles.primaryButtonText, selectedGoals.length === 0 && styles.primaryButtonTextDisabled]}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.trustItem}>
            <ShieldCheck size={14} color="#8A7A71" />
            <Text style={styles.trustText}>Tailors your AI plan to your goals.</Text>
          </View>
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
  cardsContainer: { width: '100%', paddingBottom: 20 },
  grid: {
    flexDirection: 'column',
    width: '100%',
  },
  gridItem: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16,
    borderRadius: 24, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02, shadowRadius: 8,
    height: 76,
  },
  iconContainer: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  cardIcon: { fontSize: 22 },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#3A302B', flex: 1 },
  cardTitleSelected: { fontWeight: '600', color: '#2A2421' },
  checkContainer: { 
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center' 
  },
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
  trustItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 10 },
  trustText: { flex: 1, fontSize: 11, color: '#8A7A71', fontWeight: '500', textAlign: 'center' },
});
