import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, DimensionValue, Modal } from 'react-native';
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
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ScanFace, Sparkles, TrendingUp, X, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#D7C1B3';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Custom Google SVG Icon
const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </Svg>
);

export function WelcomeScreen() {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  
  // Shared values for entrance animations
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  
  const cardsOpacity = useSharedValue(0);
  const cardsTranslateY = useSharedValue(30);
  
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  // Shared values for continuous animations
  const logoFloat = useSharedValue(0);
  const buttonBreathe = useSharedValue(1);
  const scanPulse = useSharedValue(0);
  
  useEffect(() => {
    // Entrance Animations
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    subtitleTranslateY.value = withDelay(600, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    cardsOpacity.value = withDelay(900, withTiming(1, { duration: 1000 }));
    cardsTranslateY.value = withDelay(900, withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }));
    
    ctaOpacity.value = withDelay(1200, withTiming(1, { duration: 1000 }));
    ctaTranslateY.value = withDelay(1200, withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }));

    // Continuous Animations
    logoFloat.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(6, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    
    buttonBreathe.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
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

  const logoEntranceStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { translateY: logoTranslateY.value },
      { translateY: logoFloat.value }
    ]
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scanPulse.value, [0, 1], [0.8, 1.8]) }],
    opacity: interpolate(scanPulse.value, [0, 0.8, 1], [0.8, 0, 0]),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }]
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }]
  }));

  const cardsStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsTranslateY.value }]
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }]
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonBreathe.value }]
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, WARM_NUDE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Animated.View style={[styles.logoWrapper, logoEntranceStyle]}>
              <Animated.View style={[styles.pulseRing, pulseStyle]} />
              <View style={styles.logoBackgroundGlow} />
              <Image
                source={require('../../assets/images/Faceora App Logo circle.png')}
                style={styles.logo}
                contentFit="contain"
              />
              {/* Subtle Mesh Simulation */}
              <View style={styles.meshOverlay} />
            </Animated.View>
            

          </View>

          {/* Features Section */}
          <Animated.View style={[styles.featuresSection, cardsStyle]}>
            <FeatureCard 
              icon={<ScanFace size={24} color="#7A665A" />}
              title="AI Face Scan"
              description="Analyze skin instantly using advanced AI technology."
            />
            <FeatureCard 
              icon={<Sparkles size={24} color="#7A665A" />}
              title="Personalized Insights"
              description="Receive customized recommendations based on your skin condition."
            />
            <FeatureCard 
              icon={<TrendingUp size={24} color="#7A665A" />}
              title="Progress Tracking"
              description="Monitor improvements and compare results over time."
            />
          </Animated.View>

          {/* CTA & Footer */}
          <Animated.View style={[styles.ctaSection, ctaStyle]}>
            <Animated.View style={[styles.primaryButton, buttonStyle]}>
              <TouchableOpacity 
                style={StyleSheet.absoluteFill}
                activeOpacity={0.8}
                onPress={() => {
                  console.log('Button pressed, navigating to /gender-input');
                  router.push('/gender-input');
                }}
              >
                <LinearGradient
                  colors={['#8C776B', '#635147']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButtonGradient}
                >
                  <Text style={styles.primaryButtonText}>Start Skin Analysis</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsLoginModalVisible(true)}>
              <Text style={styles.secondaryButtonText}>
                Already have an account? <Text style={styles.signInText}>Sign in</Text>
              </Text>
            </TouchableOpacity>
            
            

          </Animated.View>

        </ScrollView>
      </SafeAreaView>


      {/* Login Modal */}
      <Modal
        visible={isLoginModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLoginModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderSpacer} />
              <Text style={styles.modalTitle}>Sign in</Text>
              <TouchableOpacity onPress={() => setIsLoginModalVisible(false)} style={styles.closeButton}>
                <X size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalDivider} />
            
            <View style={styles.modalBody}>
              <TouchableOpacity style={styles.authButton}>
                <GoogleIcon size={24} />
                <Text style={styles.authButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.authButton} 
                onPress={() => {
                  setIsLoginModalVisible(false);
                  router.push('/email-signin');
                }}
              >
                <Mail size={24} color="#1C1C1E" />
                <Text style={styles.authButtonText}>Sign in with Email</Text>
              </TouchableOpacity>
              
              <Text style={styles.termsText}>
                By continuing, you agree to Cal Al&apos;s{' '}
                <Text style={styles.termsLink}>Terms and</Text>{'\n'}
                <Text style={styles.termsLink}>Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIconContainer}>
        {icon}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  logoBackgroundGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  logo: {
    width: 120,
    height: 120,
    zIndex: 2,
  },
  meshOverlay: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    zIndex: 3,
  },
  headline: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2A2421',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6A5F58',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  featuresSection: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#3A322D',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7A6D65',
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    shadowColor: '#5C4A41',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    marginBottom: 16,
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
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#2A2421',
    fontSize: 16,
    fontWeight: '400',
  },
  signInText: {
    fontWeight: '700',
    color: '#2A2421',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    position: 'relative',
  },
  modalHeaderSpacer: {
    width: 36,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    width: '100%',
    marginBottom: 24,
  },
  modalBody: {
    paddingHorizontal: 24,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  termsText: {
    fontSize: 13,
    color: '#8A8A8E',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: '#1C1C1E',
  },
});
