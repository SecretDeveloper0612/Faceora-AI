import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

const { width, height } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const WARM_BEIGE = '#D7C1B3';
const SOFT_CHAMPAGNE = '#E8DDD6';

export function FaceoraSplash() {
  const [visible, setVisible] = useState(true);

  // Shared Values
  const bgOpacity = useSharedValue(0);
  const particlesOpacity = useSharedValue(0);
  
  const cornersScale = useSharedValue(1.5);
  const cornersOpacity = useSharedValue(0);
  
  const pulseScale = useSharedValue(0.5);
  const pulseOpacity = useSharedValue(0);
  
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  
  const scanLineTranslateY = useSharedValue(-100);
  const scanLineOpacity = useSharedValue(0);
  const meshOpacity = useSharedValue(0);
  
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(10);
  
  const globalOpacity = useSharedValue(1);

  useEffect(() => {
    // Scene 1: Background fade in
    bgOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.ease) });
    particlesOpacity.value = withDelay(500, withTiming(0.6, { duration: 1000 }));
    
    // Scene 2: Corners and Pulse
    cornersOpacity.value = withDelay(1000, withTiming(1, { duration: 800 }));
    cornersScale.value = withDelay(1000, withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) }));
    
    pulseOpacity.value = withDelay(1200, withSequence(
      withTiming(0.4, { duration: 400 }),
      withTiming(0, { duration: 600 })
    ));
    pulseScale.value = withDelay(1200, withTiming(2.5, { duration: 1000, easing: Easing.out(Easing.ease) }));
    
    // Scene 3: Logo appearance & 3D Glassmorphism
    logoOpacity.value = withDelay(2000, withTiming(1, { duration: 800 }));
    logoScale.value = withDelay(2000, withSpring(1, { damping: 15, stiffness: 100 }));
    
    // Scene 4: AI Scan Effect
    meshOpacity.value = withDelay(2800, withSequence(
      withTiming(0.4, { duration: 400 }),
      withTiming(0, { duration: 800 })
    ));
    scanLineOpacity.value = withDelay(3000, withSequence(
      withTiming(0.8, { duration: 200 }),
      withDelay(600, withTiming(0, { duration: 200 }))
    ));
    scanLineTranslateY.value = withDelay(3000, withTiming(100, { duration: 1000, easing: Easing.inOut(Easing.ease) }));
    
    // Scene 5: Title
    titleOpacity.value = withDelay(4000, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(4000, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    // Scene 6: Tagline
    taglineOpacity.value = withDelay(5000, withTiming(1, { duration: 800 }));
    taglineTranslateY.value = withDelay(5000, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    // Final Fade out into Home Screen
    globalOpacity.value = withDelay(6500, withTiming(0, { duration: 800 }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    }));

    // Fallback to guarantee it unmounts
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 7500);

    return () => clearTimeout(timeout);
  }, []);


  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const cornersStyle = useAnimatedStyle(() => ({
    opacity: cornersOpacity.value,
    transform: [{ scale: cornersScale.value }]
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }]
  }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }]
  }));
  const scanLineStyle = useAnimatedStyle(() => ({
    opacity: scanLineOpacity.value,
    transform: [{ translateY: scanLineTranslateY.value }]
  }));
  const meshStyle = useAnimatedStyle(() => ({
    opacity: meshOpacity.value,
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }]
  }));
  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }]
  }));
  const globalStyle = useAnimatedStyle(() => ({ 
    opacity: globalOpacity.value, 
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999,
  }));

  // Generate deterministic random positions for particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    top: `${(Math.sin(i * 123) * 0.5 + 0.5) * 100}%` as DimensionValue,
    left: `${(Math.cos(i * 321) * 0.5 + 0.5) * 100}%` as DimensionValue,
    size: (Math.sin(i * 42) * 0.5 + 0.5) * 4 + 2,
    opacity: (Math.sin(i * 7) * 0.5 + 0.5) * 0.5 + 0.2,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, globalStyle]} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
        <LinearGradient
          colors={[IVORY_WHITE, SOFT_CHAMPAGNE, WARM_BEIGE]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      
      {/* Background Particles */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: particlesOpacity }]} pointerEvents="none">
         {particles.map((p, i) => (
           <View key={i} style={[styles.particle, { 
             top: p.top, 
             left: p.left,
             width: p.size,
             height: p.size,
             opacity: p.opacity
           }]} />
         ))}
      </Animated.View>

      <View style={styles.content}>
        {/* Animated Scanning Corners */}
        <Animated.View style={[styles.cornersContainer, cornersStyle]}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </Animated.View>

        {/* Pulse */}
        <Animated.View style={[styles.pulse, pulseStyle]} />

        {/* Logo Container */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          {/* Glassmorphism background */}
          <View style={styles.glassBackground} />
          
          <Image
            source={require('../../assets/images/Faceora App Logo circle.png')}
            style={styles.logo}
            contentFit="contain"
            transition={500}
          />
          
          {/* Facial Mesh overlay simulation */}
          <Animated.View style={[styles.meshOverlay, meshStyle]}>
            <View style={styles.meshGrid} />
          </Animated.View>

          {/* Scanning Line */}
          <Animated.View style={[styles.scanLineContainer, scanLineStyle]}>
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            />
          </Animated.View>
        </Animated.View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Animated.View style={titleStyle}>
            <Text style={styles.title}>FACEORA</Text>
            <Text style={styles.subtitle}>AI SKIN INTELLIGENCE</Text>
          </Animated.View>

          <Animated.View style={taglineStyle}>
            <Text style={styles.tagline}>Scan. Analyze. Glow.</Text>
          </Animated.View>
        </View>

      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: IVORY_WHITE,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  cornersContainer: {
    position: 'absolute',
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopLeftRadius: 24,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopRightRadius: 24,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomLeftRadius: 24,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomRightRadius: 24,
  },
  pulse: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  logoContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
  },
  glassBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
  },
  logo: {
    width: 140,
    height: 140,
    zIndex: 2,
  },
  scanLineContainer: {
    position: 'absolute',
    top: 0,
    left: -20,
    width: 200,
    height: 3,
    zIndex: 5,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  meshOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    overflow: 'hidden',
    borderRadius: 80,
  },
  meshGrid: {
    width: '120%',
    height: '120%',
    opacity: 0.6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 80,
    borderStyle: 'dashed',
  },
  textContainer: {
    position: 'absolute',
    bottom: height * 0.18,
    alignItems: 'center',
    gap: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: 10,
    color: '#3A3A3A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 4,
    color: '#8A8A8A',
    textAlign: 'center',
    marginTop: 12,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1.5,
    color: '#9A9A9A',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
