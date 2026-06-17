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
  useAnimatedScrollHandler,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ShieldCheck, CheckCircle2, CircleDot, Circle, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#D7C1B3';

const ITEM_WIDTH = 14; // Width per tick
const CENTER_OFFSET = width / 2; // Half screen width to center

const HEIGHTS_CM = Array.from({ length: 121 }, (_, i) => 100 + i); // 100 to 220
const HEIGHTS_FT: string[] = [];
for (let f = 4; f <= 7; f++) {
  for (let i = 0; i < 12; i++) {
    if (f === 7 && i > 2) break;
    HEIGHTS_FT.push(`${f}'${i}"`);
  }
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function HeightInputScreen({ onContinue }: { onContinue?: (height: string | number, unit: 'cm' | 'ft') => void }) {
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [selectedHeight, setSelectedHeight] = useState<string | number>(170);
  
  // Shared values
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const logoFloat = useSharedValue(0);
  const scanPulse = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  const progressWidth = useSharedValue(21);

  const scrollX = useSharedValue(70 * ITEM_WIDTH); // Default to 170cm (170 - 100 = 70)

  useEffect(() => {
    // Entrance Animations
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    logoTranslateY.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) });
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    ctaOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
    ctaTranslateY.value = withDelay(800, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    progressWidth.value = withDelay(300, withTiming(28, { duration: 1000, easing: Easing.out(Easing.exp) }));

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

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / ITEM_WIDTH);
      const list = unit === 'cm' ? HEIGHTS_CM : HEIGHTS_FT;
      if (index >= 0 && index < list.length) {
        runOnJS(setSelectedHeight)(list[index]);
      }
    },
  });

  const switchUnit = (newUnit: 'cm' | 'ft') => {
    if (unit === newUnit) return;
    setUnit(newUnit);
    // Reset to roughly middle index for seamless UX
    const defaultIndex = newUnit === 'cm' ? 70 : 20; // 170cm or 5'8"
    scrollX.value = defaultIndex * ITEM_WIDTH;
    setSelectedHeight(newUnit === 'cm' ? HEIGHTS_CM[defaultIndex] : HEIGHTS_FT[defaultIndex]);
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

  const currentList = unit === 'cm' ? HEIGHTS_CM : HEIGHTS_FT;

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
          <Text style={styles.headline}>What&apos;s Your Height?</Text>
          
          {/* Unit Switcher */}
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity 
              style={[styles.unitButton, unit === 'cm' && styles.unitButtonActive]} 
              onPress={() => switchUnit('cm')}
            >
              <Text style={[styles.unitText, unit === 'cm' && styles.unitTextActive]}>cm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.unitButton, unit === 'ft' && styles.unitButtonActive]} 
              onPress={() => switchUnit('ft')}
            >
              <Text style={[styles.unitText, unit === 'ft' && styles.unitTextActive]}>ft/in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.displayArea}>
            <Text style={styles.selectedValueText}>
              {unit === 'cm' ? selectedHeight : (selectedHeight as string).split('"')[0]}
              {unit === 'ft' && <Text style={styles.selectedUnitText}>&quot;</Text>}
            </Text>
            <Text style={styles.selectedUnitLabel}>{unit === 'cm' ? 'cm' : 'ft/in'}</Text>
          </View>

          {/* Horizontal Ruler Picker */}
          <View style={styles.rulerContainer}>
            <View style={styles.rulerCenterIndicator} pointerEvents="none" />
            <Animated.ScrollView
              horizontal
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              contentOffset={{ x: (unit === 'cm' ? 70 : 20) * ITEM_WIDTH, y: 0 }}
              contentContainerStyle={{ paddingHorizontal: CENTER_OFFSET }}
              style={styles.rulerScroll}
            >
              {currentList.map((val, i) => {
                const isLongTick = unit === 'cm' ? (val as number) % 10 === 0 : (val as string).includes('\'0"');
                const isMediumTick = unit === 'cm' ? (val as number) % 5 === 0 : false;
                
                return (
                  <View key={i} style={styles.tickWrapper}>
                    <View style={[
                      styles.tick, 
                      isLongTick && styles.tickLong,
                      isMediumTick && !isLongTick && styles.tickMedium
                    ]} />
                    {isLongTick && (
                      <Text style={styles.tickLabel}>
                        {unit === 'cm' ? val : (val as string).split('\'')[0] + "'"}
                      </Text>
                    )}
                  </View>
                );
              })}
            </Animated.ScrollView>
          </View>

        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <AnimatedTouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={() => onContinue?.(selectedHeight, unit)}
          >
            <LinearGradient
              colors={['#8C776B', '#635147']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </LinearGradient>
          </AnimatedTouchableOpacity>
          
          <View style={styles.trustItem}>
            <ShieldCheck size={14} color="#8A7A71" />
            <Text style={styles.trustText}>Used to improve personalized insights.</Text>
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
    paddingHorizontal: 24, paddingTop: 16, marginBottom: 24,
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
  topSection: { alignItems: 'center', marginTop: 12, marginBottom: 12 },
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
  contentSection: { alignItems: 'center', paddingHorizontal: 0, flex: 1, width: '100%', paddingTop: 32 },
  headline: {
    fontSize: 28, fontWeight: '600', color: '#2A2421', textAlign: 'center',
    marginBottom: 20, letterSpacing: -0.5,
  },
  unitToggleContainer: {
    flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20, padding: 4, marginBottom: 32,
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  unitButton: {
    paddingVertical: 8, paddingHorizontal: 24, borderRadius: 16,
  },
  unitButtonActive: {
    backgroundColor: '#8C776B', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  unitText: { fontSize: 14, fontWeight: '600', color: '#8A7A71' },
  unitTextActive: { color: '#FFF' },
  
  displayArea: {
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40,
    height: 100,
  },
  selectedValueText: {
    fontSize: 76,
    fontWeight: '300',
    color: '#2A2421',
    letterSpacing: -2,
    includeFontPadding: false,
  },
  selectedUnitText: {
    fontSize: 50,
  },
  selectedUnitLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#8A7A71',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: -8,
  },

  rulerContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  rulerCenterIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -1.5,
    width: 3,
    height: 50,
    backgroundColor: '#8C776B',
    borderRadius: 2,
    zIndex: 10,
    shadowColor: '#8C776B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  rulerScroll: {
    width: '100%',
  },
  tickWrapper: {
    width: ITEM_WIDTH,
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tick: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(138, 122, 113, 0.3)',
    borderRadius: 1,
  },
  tickMedium: {
    height: 30,
    backgroundColor: 'rgba(138, 122, 113, 0.5)',
  },
  tickLong: {
    height: 40,
    backgroundColor: 'rgba(138, 122, 113, 0.8)',
    width: 2.5,
  },
  tickLabel: {
    position: 'absolute',
    bottom: 15,
    fontSize: 14,
    fontWeight: '600',
    color: '#6A5F58',
  },
  spacer: { flex: 1 },
  ctaSection: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  primaryButton: {
    width: width - 48, height: 60, borderRadius: 30, shadowColor: '#5C4A41',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, marginBottom: 16,
  },
  primaryButtonGradient: {
    width: '100%', height: '100%', borderRadius: 30, alignItems: 'center', justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  trustItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  trustText: { fontSize: 12, color: '#8A7A71', fontWeight: '500' },
});
