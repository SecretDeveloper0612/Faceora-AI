import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, DimensionValue, KeyboardAvoidingView, Platform } from 'react-native';
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
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ShieldCheck, User, Sparkles, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#D7C1B3';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function NameInputScreen({ onContinue }: { onContinue?: (name: string) => void }) {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Shared values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const logoFloat = useSharedValue(0);
  const scanPulse = useSharedValue(0);
  
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  
  const inputOpacity = useSharedValue(0);
  const inputTranslateY = useSharedValue(20);
  const focusScale = useSharedValue(1);
  
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  // Avatar reaction values
  const avatarScale = useSharedValue(1);
  const sparklesOpacity = useSharedValue(0);
  const sparklesRotate = useSharedValue(0);

  // Greeting values
  const greetingOpacity = useSharedValue(0);
  const greetingTranslateY = useSharedValue(10);

  const progressWidth = useSharedValue(7);

  useEffect(() => {
    // Entrance Animations
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    
    textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    inputOpacity.value = withDelay(700, withTiming(1, { duration: 800 }));
    inputTranslateY.value = withDelay(700, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    ctaOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    ctaTranslateY.value = withDelay(1000, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    // Animate Progress Bar
    progressWidth.value = withDelay(300, withTiming(14, { duration: 1000, easing: Easing.out(Easing.exp) }));

    // Continuous float
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
  }, []);

  useEffect(() => {
    if (name.length > 0) {
      greetingOpacity.value = withTiming(1, { duration: 500 });
      greetingTranslateY.value = withSpring(0, { damping: 12 });
      
      // Avatar reaction when typing
      avatarScale.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withSpring(1, { damping: 10 })
      );
      sparklesOpacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(400, withTiming(0, { duration: 400 }))
      );
      sparklesRotate.value = withSequence(
        withTiming(1, { duration: 600 })
      );
    } else {
      greetingOpacity.value = withTiming(0, { duration: 300 });
      greetingTranslateY.value = withTiming(10, { duration: 300 });
    }
  }, [name]);

  useEffect(() => {
    if (isFocused) {
      focusScale.value = withSpring(1.02, { damping: 15 });
    } else {
      focusScale.value = withSpring(1, { damping: 15 });
    }
  }, [isFocused]);

  const logoEntranceStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: logoTranslateY.value },
      { translateY: logoFloat.value }
    ]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scanPulse.value, [0, 1], [0.8, 2]) }],
    opacity: interpolate(scanPulse.value, [0, 0.8, 1], [0.5, 0, 0]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }]
  }));

  const inputContainerStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [
      { translateY: inputTranslateY.value },
      { scale: focusScale.value }
    ]
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }]
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }]
  }));

  const sparklesStyle = useAnimatedStyle(() => ({
    opacity: sparklesOpacity.value,
    transform: [{ rotateZ: `${interpolate(sparklesRotate.value, [0, 1], [0, 45])}deg` }]
  }));

  const greetingStyle = useAnimatedStyle(() => ({
    opacity: greetingOpacity.value,
    transform: [{ translateY: greetingTranslateY.value }]
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }));

  const particles = Array.from({ length: 12 }).map((_, i) => ({
    top: `${(Math.sin(i * 111) * 0.5 + 0.5) * 100}%` as DimensionValue,
    left: `${(Math.cos(i * 222) * 0.5 + 0.5) * 100}%` as DimensionValue,
    size: (Math.sin(i * 333) * 0.5 + 0.5) * 5 + 2,
    opacity: (Math.sin(i * 444) * 0.5 + 0.5) * 0.5 + 0.1,
  }));

  const isContinueEnabled = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, WARM_NUDE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      {/* Background Particles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {particles.map((p, i) => (
          <View key={i} style={[styles.particle, { 
            top: p.top, 
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity
          }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <OnboardingHeader progressStyle={progressStyle} />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          


          {/* Welcome Message */}
          <Animated.View style={[styles.textSection, textStyle]}>
            <Text style={styles.headline}>Welcome to Faceora</Text>
            <Text style={styles.subheadline}>Let&apos;s personalize your skincare journey.</Text>
          </Animated.View>

          {/* Input & Avatar Section */}
          <Animated.View style={[styles.inputSection, inputContainerStyle]}>
            {/* Avatar Reaction */}
            <View style={styles.avatarContainer}>
              <Animated.View style={[styles.avatarCircle, avatarStyle]}>
                <User size={32} color="#8A7A71" strokeWidth={1.5} />
              </Animated.View>
              <Animated.View style={[styles.sparkles, sparklesStyle]}>
                <Sparkles size={20} color="#8C776B" strokeWidth={2} />
              </Animated.View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>What should we call you?</Text>
              <View style={[styles.glassInputContainer, isFocused && styles.glassInputFocused]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#A99F98"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  selectionColor="#8A7A71"
                  autoCorrect={false}
                  autoCapitalize="words"
                />
              </View>
            </View>
          </Animated.View>

          <View style={styles.spacer} />

          {/* CTA & Footer */}
          <Animated.View style={[styles.ctaSection, ctaStyle]}>
            <Animated.View style={styles.greetingContainer}>
              <Animated.Text style={[styles.greetingText, greetingStyle]}>
                Hi, {name || 'there'} 👋
              </Animated.Text>
            </Animated.View>
            
            <AnimatedTouchableOpacity 
              style={[
                styles.primaryButton, 
                !isContinueEnabled && styles.primaryButtonDisabled
              ]} 
              activeOpacity={0.8}
              disabled={!isContinueEnabled}
              onPress={() => onContinue?.(name)}
            >
              <LinearGradient
                colors={isContinueEnabled ? ['#8C776B', '#635147'] : ['rgba(140, 119, 107, 0.4)', 'rgba(99, 81, 71, 0.4)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={[styles.primaryButtonText, !isContinueEnabled && styles.primaryButtonTextDisabled]}>Continue</Text>
              </LinearGradient>
            </AnimatedTouchableOpacity>
            
            <View style={styles.trustItem}>
              <ShieldCheck size={14} color="#8A7A71" />
              <Text style={styles.trustText}>Your information stays private and secure.</Text>
            </View>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
    </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  logoBackgroundGlow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  logo: {
    width: 56,
    height: 56,
    zIndex: 2,
  },
  meshOverlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    zIndex: 3,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  headline: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2A2421',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6A5F58',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  sparkles: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
  },
  inputWrapper: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A4C44',
    marginBottom: 12,
    paddingLeft: 8,
  },
  glassInputContainer: {
    width: '100%',
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  glassInputFocused: {
    borderColor: 'rgba(140, 119, 107, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowOpacity: 0.04,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#2A2421',
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  ctaSection: {
    alignItems: 'center',
    width: '100%',
  },
  greetingContainer: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2A2421',
    letterSpacing: -0.3,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    shadowColor: '#5C4A41',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    marginBottom: 20,
  },
  primaryButtonDisabled: {
    shadowOpacity: 0,
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  primaryButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    color: '#8A7A71',
    fontWeight: '500',
  },
});
