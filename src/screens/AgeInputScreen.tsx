import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
  Extrapolation,
  SharedValue,
  useAnimatedRef,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, CheckCircle2, CircleDot, Circle, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#D7C1B3';

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => (currentYear - 100 + i + 1).toString());

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function WheelPickerItem({ label, index, scrollY }: { label: string, index: number, scrollY: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const itemPosition = index * ITEM_HEIGHT;
    const distance = Math.abs(scrollY.value - itemPosition);
    
    const scale = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1, 0.9, 0.8], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1, 0.4, 0.2], Extrapolation.CLAMP);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.pickerItem, style]}>
      <Text style={styles.pickerItemText}>{label}</Text>
    </Animated.View>
  );
}

function WheelPicker({ data, value, onValueChange, itemWidth }: { data: string[], value: string, onValueChange: (val: string) => void, itemWidth: number }) {
  const scrollY = useSharedValue(0);
  const initialIndex = data.indexOf(value);
  const scrollViewRef = useAnimatedRef<any>();
  
  useEffect(() => {
    if (initialIndex >= 0) {
      scrollY.value = initialIndex * ITEM_HEIGHT;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: initialIndex * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  }, []);

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (index >= 0 && index < data.length) {
        runOnJS(onValueChange)(data[index]);
      }
    },
    onEndDrag: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (index >= 0 && index < data.length) {
        runOnJS(onValueChange)(data[index]);
      }
    }
  });

  return (
    <View style={{ width: itemWidth, height: PICKER_HEIGHT }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingVertical: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
        }}
        style={{ width: '100%', height: '100%', zIndex: 2 }}
      >
        {data.map((item, i) => (
          <WheelPickerItem key={item} label={item} index={i} scrollY={scrollY} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

export function AgeInputScreen({ onContinue }: { onContinue?: (age: number) => void }) {
  const [month, setMonth] = useState('January');
  const [day, setDay] = useState('01');
  const [year, setYear] = useState('2001');
  
  // Shared values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  const progressWidth = useSharedValue(14);

  useEffect(() => {
    // Entrance Animations
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    ctaOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    ctaTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    // Animate Progress Bar
    progressWidth.value = withDelay(300, withTiming(21, { duration: 1000, easing: Easing.out(Easing.exp) }));
  }, []);

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, WARM_NUDE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea}>
        
        <OnboardingHeader progressStyle={progressStyle} />

        {/* Main Content */}
        <Animated.View style={[styles.contentSection, contentStyle]}>
          <Text style={styles.headline}>When were you born?</Text>
          <Text style={styles.subheadline}>This helps us provide more accurate skin insights.</Text>

          <View style={styles.interactiveArea}>
            <View style={styles.pickersContainer}>
              {/* Highlight Pill behind selected row */}
              <View style={styles.pickerHighlightContainer} pointerEvents="none">
                <View style={[styles.pickerHighlight, { width: 130 }]} />
                <View style={[styles.pickerHighlight, { width: 60 }]} />
                <View style={[styles.pickerHighlight, { width: 90 }]} />
              </View>

              <WheelPicker data={MONTHS} value={month} onValueChange={setMonth} itemWidth={130} />
              <WheelPicker data={DAYS} value={day} onValueChange={setDay} itemWidth={60} />
              <WheelPicker data={YEARS} value={year} onValueChange={setYear} itemWidth={90} />
            </View>
          </View>
        </Animated.View>

        <View style={styles.spacer} />

        {/* CTA & Footer */}
        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <AnimatedTouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={() => onContinue?.(new Date().getFullYear() - parseInt(year))}
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
            <Text style={styles.trustText}>Your information is encrypted and private.</Text>
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
  progressContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  progressStep: { alignItems: 'center', gap: 4 },
  progressLine: {
    flex: 1, height: 1, backgroundColor: '#C5B5AA',
    marginHorizontal: 8, marginBottom: 16, opacity: 0.5,
  },
  progressTextCompleted: { fontSize: 10, fontWeight: '600', color: '#8A7A71' },
  progressTextActive: { fontSize: 10, fontWeight: '700', color: '#5A4C44' },
  progressTextPending: { fontSize: 10, fontWeight: '500', color: '#B3A39A' },
  contentSection: { paddingHorizontal: 24, flex: 1, paddingTop: 16 },
  headline: {
    fontSize: 34, fontWeight: '700', color: '#1C1C1E',
    marginBottom: 12, letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 16, fontWeight: '400', color: '#6A5F58',
    lineHeight: 24, marginBottom: 48,
  },
  interactiveArea: {
    alignItems: 'center', width: '100%',
  },
  pickersContainer: {
    flexDirection: 'row', gap: 12, height: PICKER_HEIGHT, width: '100%', justifyContent: 'center'
  },
  pickerHighlightContainer: {
    position: 'absolute', top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2, width: '100%', height: ITEM_HEIGHT,
    flexDirection: 'row', gap: 12, justifyContent: 'center', zIndex: 1,
  },
  pickerHighlight: {
    height: ITEM_HEIGHT, backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, shadowRadius: 8,
  },
  pickerItem: { height: ITEM_HEIGHT, alignItems: 'center', justifyContent: 'center' },
  pickerItemText: { fontSize: 20, fontWeight: '600', color: '#2A2421' },
  spacer: { flex: 1 },
  ctaSection: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  primaryButton: {
    width: '100%', height: 60, borderRadius: 30, shadowColor: '#5C4A41',
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, marginBottom: 16,
  },
  primaryButtonGradient: {
    width: '100%', height: '100%', borderRadius: 30, alignItems: 'center', justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', letterSpacing: 0.5 },
  trustItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  trustText: { fontSize: 12, color: '#8A7A71', fontWeight: '500' },
});
