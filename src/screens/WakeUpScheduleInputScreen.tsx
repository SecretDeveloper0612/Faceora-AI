"use no memo";
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
import { ShieldCheck } from 'lucide-react-native';
import { OnboardingHeader } from '@/components/OnboardingHeader';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#DCC7BC';

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const AMPM = ['AM', 'PM'];

function WheelPickerItem({ label, index, scrollY }: { label: string, index: number, scrollY: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const itemPosition = index * ITEM_HEIGHT;
    const distance = Math.abs((scrollY.value + 2 * ITEM_HEIGHT) - itemPosition);
    
    const scale = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1.15, 0.85, 0.7], Extrapolation.CLAMP);
    const opacity = interpolate(distance, [0, ITEM_HEIGHT, ITEM_HEIGHT * 2], [1, 0.3, 0.1], Extrapolation.CLAMP);

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
  const paddedData = ['', '', ...data, '', ''];
  const scrollViewRef = useAnimatedRef<any>();
  
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

  useEffect(() => {
    if (initialIndex >= 0) {
      scrollY.value = initialIndex * ITEM_HEIGHT;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: initialIndex * ITEM_HEIGHT, animated: false });
      }, 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex, scrollViewRef]);

  return (
    <View style={{ width: itemWidth, height: PICKER_HEIGHT }}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        style={{ width: '100%', height: '100%', zIndex: 2 }}
      >
        {paddedData.map((item, i) => (
          <WheelPickerItem key={`${item}-${i}`} label={item} index={i} scrollY={scrollY} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

export function WakeUpScheduleInputScreen({ onContinue }: { onContinue?: (time: string) => void }) {
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState('AM');
  
  // Shared values
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);
  
  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  // Progress Bar
  const progressWidth = useSharedValue(77);

  useEffect(() => {
    // Entrance Animations
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));
    
    ctaOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    ctaTranslateY.value = withDelay(400, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    // Animate Progress Bar
    progressWidth.value = withDelay(300, withTiming(84, { duration: 1000, easing: Easing.out(Easing.exp) }));
  }, [contentOpacity, contentTranslateY, ctaOpacity, ctaTranslateY, progressWidth]);

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

        <Animated.View style={[styles.contentSection, contentStyle]}>
          <Text style={styles.headline}>What time do you wake up?</Text>
          <Text style={styles.subheadline}>Morning routines set the tone for your daily skin protection.</Text>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerOverlay} pointerEvents="none">
              <View style={styles.pickerOverlayBorder} />
            </View>

            <View style={styles.wheelsRow}>
              <WheelPicker 
                data={HOURS} 
                value={hour} 
                onValueChange={setHour} 
                itemWidth={66} 
              />
              <Text style={styles.colon}>:</Text>
              <WheelPicker 
                data={MINUTES} 
                value={minute} 
                onValueChange={setMinute} 
                itemWidth={66} 
              />
              <View style={{ width: 16 }} />
              <WheelPicker 
                data={AMPM} 
                value={period} 
                onValueChange={setPeriod} 
                itemWidth={66} 
              />
            </View>
          </View>

          <View style={styles.selectedTimeContainer}>
            <Text style={styles.selectedTimeText}>
              {hour}:{minute} {period}
            </Text>
          </View>

        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={[styles.ctaSection, ctaStyle]}>
          <TouchableOpacity 
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => onContinue?.(`${hour}:${minute} ${period}`)}
          >
            <LinearGradient
              colors={['#8C776B', '#635147']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.trustItem}>
            <ShieldCheck size={14} color="#8A7A71" />
            <Text style={styles.trustText}>Your data is securely stored and never shared.</Text>
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
  contentSection: { alignItems: 'center', paddingHorizontal: 24, flex: 1, paddingTop: 20 },
  headline: {
    fontSize: 22, fontWeight: '600', color: '#2A2421', textAlign: 'center',
    marginBottom: 6, letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 15, fontWeight: '400', color: '#6A5F58', textAlign: 'center',
    lineHeight: 22, paddingHorizontal: 8, marginBottom: 40,
  },
  pickerContainer: {
    height: PICKER_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 20,
  },
  pickerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: 1,
  },
  pickerOverlayBorder: {
    height: ITEM_HEIGHT + 8, width: 250,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#5C4A41', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06, shadowRadius: 16,
  },
  wheelsRow: { flexDirection: 'row', alignItems: 'center', zIndex: 2 },
  pickerItem: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  pickerItemText: { fontSize: 24, fontWeight: '700', color: '#2A2421' },
  colon: { fontSize: 26, fontWeight: '700', color: '#2A2421', marginHorizontal: 2, paddingBottom: 4, opacity: 0.8 },
  selectedTimeContainer: {
    marginTop: 40, marginBottom: 40, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  selectedTimeText: { fontSize: 16, fontWeight: '600', color: '#5A4C44' },
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
  trustText: { fontSize: 11, color: '#8A7A71', fontWeight: '500' },
});

