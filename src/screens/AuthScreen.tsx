"use no memo";
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, DimensionValue, TextInput, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ShieldCheck, Mail, Sparkles, LockKeyhole, ChevronLeft, ArrowRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#DCC7BC'; 

// Custom Google SVG Icon
const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </Svg>
);

// Custom Apple SVG Icon
const AppleIcon = ({ size = 20, color = "#FFF" }: { size?: number, color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.05 2.78.72 3.4 1.8-3.08 1.74-2.56 5.86.36 7.11-.64 1.63-1.63 3.16-2.41 4.1zm-3.56-14.7c.36-1.57-.4-3.07-1.69-3.95-.56.45-1.14 1.18-1.39 2.02-.32 1.05-.18 2.1.2 2.87.52-.16 2.45-.88 2.88-2.94z" />
  </Svg>
);

export function AuthScreen({ onAuthenticate }: { onAuthenticate?: (method: string) => void }) {
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);

  // Shared values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const logoFloat = useSharedValue(0);
  const scanPulse = useSharedValue(0);
  
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);

  const loadingOpacity = useSharedValue(0);



  useEffect(() => {
    if (loadingMethod) {
      loadingOpacity.value = withTiming(1, { duration: 400 });
      // Simulate authentication complete
      setTimeout(() => {
        if (onAuthenticate) onAuthenticate(loadingMethod);
        router.replace('/(tabs)');
      }, 2500);
    }
  }, [loadingMethod, onAuthenticate, loadingOpacity]);

  const handleAuth = (method: string) => {
    Keyboard.dismiss();
    setLoadingMethod(method);
    // Animate out forms slightly to focus on loading
    formOpacity.value = withTiming(0.4, { duration: 400 });
    contentOpacity.value = withTiming(0.4, { duration: 400 });
  };


  useEffect(() => {
    // Entrance Animations
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    formOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    formTranslateY.value = withDelay(800, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

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
  }, [logoOpacity, logoTranslateY, contentOpacity, contentTranslateY, formOpacity, formTranslateY, logoFloat, scanPulse]);

  const logoEntranceStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }, { translateY: logoFloat.value }]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scanPulse.value, [0, 1], [0.8, 2.5]) }],
    opacity: interpolate(scanPulse.value, [0, 0.8, 1], [0.4, 0, 0]),
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }]
  }));

  const formStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }]
  }));

  const loadingStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
    transform: [{ translateY: interpolate(loadingOpacity.value, [0, 1], [10, 0]) }]
  }));

  const particles = Array.from({ length: 15 }).map((_, i) => ({
    top: `${(Math.sin(i * 321) * 0.5 + 0.5) * 100}%` as DimensionValue,
    left: `${(Math.cos(i * 123) * 0.5 + 0.5) * 100}%` as DimensionValue,
    size: (Math.sin(i * 213) * 0.5 + 0.5) * 6 + 2,
    opacity: (Math.sin(i * 312) * 0.5 + 0.5) * 0.4 + 0.1,
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, WARM_NUDE]} style={StyleSheet.absoluteFill} />
        
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {particles.map((p, i) => (
            <View key={i} style={[styles.particle, { top: p.top, left: p.left, width: p.size, height: p.size, opacity: p.opacity }]} />
          ))}
        </View>

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.keyboardAvoid}
          >
            <View style={styles.topSection}>
              <Animated.View style={[styles.logoWrapper, logoEntranceStyle]}>
                <Animated.View style={[styles.pulseRing, pulseStyle]} />
                <Animated.View style={[styles.pulseRing, { transform: [{ scale: interpolate(scanPulse.value, [0, 1], [1, 3.5]) }], opacity: interpolate(scanPulse.value, [0, 0.6, 1], [0.2, 0, 0]) }]} />
                <View style={styles.logoBackgroundGlow} />
                <Image source={require('../../assets/images/Faceora App Logo circle.png')} style={styles.logo} contentFit="contain" />
              </Animated.View>
            </View>

            <Animated.View style={[styles.contentSection, contentStyle]}>
              <Text style={styles.headline}>Welcome to Faceora</Text>
              <Text style={styles.subheadline}>Sign in to unlock your personalized AI skin intelligence.</Text>
            </Animated.View>

            <Animated.View style={[styles.formSection, formStyle]}>
              
              <>
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity activeOpacity={0.8} style={styles.googleButton} onPress={() => handleAuth('google')} disabled={!!loadingMethod}>
                      <GoogleIcon size={22} />
                      <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.emailButton}
                      onPress={() => router.push('/email-signin')}
                      disabled={!!loadingMethod}
                    >
                      <LinearGradient colors={['#8C776B', '#635147']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                      <Mail size={22} color="#FFF" />
                      <Text style={styles.emailButtonText}>Continue with Email</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.securityContainer}>
                    <View style={styles.securityRow}>
                      <LockKeyhole size={14} color="#5A4C44" />
                      <Text style={styles.securityText}>End-to-End Secure</Text>
                    </View>
                    <View style={styles.securityRow}>
                      <ShieldCheck size={14} color="#5A4C44" />
                      <Text style={styles.securityText}>Privacy Protected</Text>
                    </View>
                    <View style={styles.securityRow}>
                      <Sparkles size={14} color="#5A4C44" />
                      <Text style={styles.securityText}>Personalized AI Analysis</Text>
                    </View>
                  </View>
                </>

            </Animated.View>

            <View style={styles.spacer} />

            <View style={styles.legalSection}>
              <Text style={styles.legalText}>
                By continuing, you agree to our{' '}
                <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
                <Text style={styles.legalLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>

        {/* Loading Overlay State */}
        <View style={styles.loadingWrapper} pointerEvents={loadingMethod ? 'auto' : 'none'}>
          <Animated.View style={[styles.loadingContainer, loadingStyle]}>
            <Animated.View style={[styles.pulseRing, pulseStyle, { position: 'relative', width: 40, height: 40, borderWidth: 2 }]} />
            <Text style={styles.loadingText}>Preparing Your AI Skin Profile...</Text>
          </Animated.View>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  safeArea: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  particle: {
    position: 'absolute', backgroundColor: '#FFF', borderRadius: 10,
    shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6,
  },
  topSection: { alignItems: 'center', marginTop: Dimensions.get('window').height * 0.06, marginBottom: 24 },
  logoWrapper: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  logoBackgroundGlow: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 24,
  },
  logo: { width: 100, height: 100, zIndex: 2 },
  
  contentSection: { alignItems: 'center', paddingHorizontal: 24, width: '100%' },
  headline: {
    fontSize: 32, fontWeight: '600', color: '#2A2421', textAlign: 'center',
    marginBottom: 12, letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 16, fontWeight: '400', color: '#6A5F58', textAlign: 'center',
    lineHeight: 24, paddingHorizontal: 20, marginBottom: 32,
  },
  
  formSection: { width: '100%', paddingHorizontal: 24 },
  buttonsContainer: { width: '100%', gap: 16 },
  
  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 56, backgroundColor: '#FFFFFF', borderRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
  },
  googleButtonText: { marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#3C4043' },
  
  appleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 56, backgroundColor: '#000000', borderRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10,
  },
  appleButtonText: { marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  
  emailButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 56, borderRadius: 28, overflow: 'hidden',
    shadowColor: '#5C4A41', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10,
  },
  emailButtonText: { marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32, paddingHorizontal: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#C5B5AA', opacity: 0.4 },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '600', color: '#8A7A71', letterSpacing: 1 },
  
  securityContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, paddingHorizontal: 10 },
  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  securityText: { fontSize: 12, fontWeight: '500', color: '#5A4C44' },

  // Email Form Styles
  emailFormContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
  },
  backButton: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 24, paddingVertical: 4, alignSelf: 'flex-start',
  },
  backButtonText: { fontSize: 15, fontWeight: '500', color: '#5A4C44', marginLeft: 4 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#6A5F58', marginBottom: 8, marginLeft: 4 },
  input: {
    height: 52, backgroundColor: '#FFFFFF', borderRadius: 16,
    paddingHorizontal: 16, fontSize: 16, color: '#2A2421',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  
  spacer: { flex: 1 },

  loadingWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(248, 246, 244, 0.95)', padding: 30, borderRadius: 24 },
  loadingText: { marginTop: 24, fontSize: 15, fontWeight: '600', color: '#5A4C44', letterSpacing: 0.5 },
  
  legalSection: { paddingHorizontal: 30, paddingBottom: 20 },
  legalText: { fontSize: 11, color: '#8A7A71', textAlign: 'center', lineHeight: 18 },
  legalLink: { fontWeight: '600', color: '#5A4C44', textDecorationLine: 'underline' },
});
