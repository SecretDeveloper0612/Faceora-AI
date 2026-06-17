import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, Animated as RNAnimated, PanResponder } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ChevronLeft, TrendingUp, Sparkles, Droplets, Moon, Activity, ArrowRightLeft } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Ultra-Clean Light Mode Colors
const BG_GRADIENT_START = '#FDFCFB';
const BG_GRADIENT_END = '#E2D1C3';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1C1C1E';
const TEXT_SECONDARY = '#8A8A8E';
const BRAND_PRIMARY = '#8C776B';

// Modern Glass Card with Soft Floating Shadow
const FloatingCard = ({ children, style, delay = 0 }: any) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View style={[styles.floatingCard, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

const BeforeAfterSlider = () => {
  const containerWidth = width - 48; // Total width minus padding
  const [sliderPosition] = React.useState(() => new RNAnimated.Value(containerWidth / 2));

  const [panResponder] = React.useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = (containerWidth / 2) + gestureState.dx;
        if (newX < 0) newX = 0;
        if (newX > containerWidth) newX = containerWidth;
        sliderPosition.setValue(newX);
      },
      onPanResponderRelease: () => {},
    })
  );

  return (
    <View style={[styles.sliderContainer, { width: containerWidth }]}>
      {/* Before Image (Background) */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=600&auto=format&fit=crop' }} 
        style={styles.sliderImage}
        contentFit="cover"
      />
      <View style={styles.labelBoxRight}><Text style={styles.labelText}>Before</Text></View>

      {/* After Image (Clipped Foreground) */}
      <RNAnimated.View style={[styles.sliderImageClipped, { width: sliderPosition }]}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=600&auto=format&fit=crop&sat=100&bri=10' }} // Simulated clear skin
          style={[styles.sliderImage, { width: containerWidth }]}
          contentFit="cover"
        />
        <View style={styles.labelBoxLeft}><Text style={styles.labelText}>After</Text></View>
      </RNAnimated.View>

      {/* Draggable Divider */}
      <RNAnimated.View 
        style={[styles.sliderDivider, { transform: [{ translateX: sliderPosition }] }]} 
        {...panResponder.panHandlers}
      >
        <View style={styles.sliderThumb}>
          <ArrowRightLeft size={16} color="#FFF" />
        </View>
      </RNAnimated.View>
    </View>
  );
};

export function ProgressScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={[BG_GRADIENT_START, BG_GRADIENT_END]} 
        style={StyleSheet.absoluteFill} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Decorative Blurred Orbs */}
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      <SafeAreaView style={styles.safeArea}>
        
        {/* Top Nav */}
        <View style={[styles.topNav, { paddingTop: Math.max(insets.top, 10) }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Progress Tracker</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <Text style={styles.headerTitle}>Your Journey</Text>
            <Text style={styles.headerSubtitle}>Track how your skin and habits have improved over time.</Text>
          </Animated.View>

          {/* Metrics Horizontal Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsScroll}>
            <FloatingCard delay={100} style={styles.metricPill}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#FDF1EB' }]}>
                <Sparkles size={16} color="#FF9500" />
              </View>
              <Text style={styles.metricPillText}>Face Score</Text>
            </FloatingCard>
            <FloatingCard delay={150} style={styles.metricPill}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#E8F5E9' }]}>
                <TrendingUp size={16} color="#34C759" />
              </View>
              <Text style={styles.metricPillText}>Skin Health</Text>
            </FloatingCard>
            <FloatingCard delay={200} style={styles.metricPill}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#E3F2FD' }]}>
                <Droplets size={16} color="#007AFF" />
              </View>
              <Text style={styles.metricPillText}>Water</Text>
            </FloatingCard>
            <FloatingCard delay={250} style={styles.metricPill}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#F4EBFF' }]}>
                <Moon size={16} color="#8A2BE2" />
              </View>
              <Text style={styles.metricPillText}>Sleep</Text>
            </FloatingCard>
            <FloatingCard delay={300} style={styles.metricPill}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#FFF0F5' }]}>
                <Activity size={16} color="#FF1493" />
              </View>
              <Text style={styles.metricPillText}>Exercise</Text>
            </FloatingCard>
          </ScrollView>

          {/* Improvement Graph */}
          <FloatingCard delay={400} style={styles.graphCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Faceora Score</Text>
              <View style={styles.trendBadge}>
                <TrendingUp size={14} color="#34C759" />
                <Text style={styles.trendText}>+15 pts</Text>
              </View>
            </View>
            <Text style={styles.graphSubtitle}>Past 4 Weeks</Text>

            <View style={styles.graphContainer}>
              <Svg height="160" width="100%" viewBox="0 0 300 160" preserveAspectRatio="none">
                <Defs>
                  <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={BRAND_PRIMARY} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={BRAND_PRIMARY} stopOpacity="0" />
                  </SvgGradient>
                </Defs>
                
                {/* Fill Area */}
                <Path d="M20,130 Q60,110 100,100 T180,60 T280,30 L280,160 L20,160 Z" fill="url(#grad)" />
                
                {/* Glowing Line behind actual line (drop shadow effect without filter) */}
                <Path d="M20,130 Q60,110 100,100 T180,60 T280,30" fill="none" stroke={BRAND_PRIMARY} strokeWidth="8" strokeOpacity="0.2" transform="translate(0,4)" />
                <Path d="M20,130 Q60,110 100,100 T180,60 T280,30" fill="none" stroke={BRAND_PRIMARY} strokeWidth="4" />
                
                {/* Data Points */}
                <Circle cx="20" cy="130" r="5" fill="#FFF" stroke={BRAND_PRIMARY} strokeWidth="3" />
                <Circle cx="100" cy="100" r="5" fill="#FFF" stroke={BRAND_PRIMARY} strokeWidth="3" />
                <Circle cx="180" cy="60" r="5" fill="#FFF" stroke={BRAND_PRIMARY} strokeWidth="3" />
                <Circle cx="280" cy="30" r="5" fill="#FFF" stroke={BRAND_PRIMARY} strokeWidth="3" />

                {/* Score Labels */}
                <SvgText fill={TEXT_PRIMARY} fontSize="12" fontWeight="800" x="15" y="150">72</SvgText>
                <SvgText fill={TEXT_PRIMARY} fontSize="12" fontWeight="800" x="95" y="120">78</SvgText>
                <SvgText fill={TEXT_PRIMARY} fontSize="12" fontWeight="800" x="175" y="80">84</SvgText>
                <SvgText fill={TEXT_PRIMARY} fontSize="12" fontWeight="800" x="270" y="50">87</SvgText>
              </Svg>
            </View>
          </FloatingCard>

          {/* Before & After Slider */}
          <FloatingCard delay={500} style={styles.sliderCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Visual Progress</Text>
              <View style={[styles.metricIconWrap, { backgroundColor: '#FDF1EB', width: 32, height: 32 }]}>
                <Sparkles size={16} color="#FF9500" />
              </View>
            </View>
            <Text style={styles.graphSubtitle}>Compare your first scan to today</Text>
            
            <View style={styles.sliderWrapper}>
              <BeforeAfterSlider />
            </View>
          </FloatingCard>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_GRADIENT_START },
  safeArea: { flex: 1 },
  
  orbTop: {
    position: 'absolute', top: -100, right: -100, width: 300, height: 300, 
    borderRadius: 150, backgroundColor: 'rgba(255, 230, 220, 0.4)'
  },
  orbBottom: {
    position: 'absolute', bottom: 100, left: -100, width: 250, height: 250, 
    borderRadius: 125, backgroundColor: 'rgba(255, 240, 245, 0.5)'
  },

  floatingCard: {
    backgroundColor: CARD_BG,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#1C1C1E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 28,
    elevation: 8,
    marginBottom: 20,
  },

  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#1C1C1E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  navTitle: { fontSize: 18, fontWeight: '700', color: TEXT_PRIMARY, letterSpacing: -0.5 },
  
  scrollContent: { paddingTop: 10, paddingBottom: 60 },
  
  header: { marginBottom: 24, paddingHorizontal: 24 },
  headerTitle: { fontSize: 32, fontWeight: '800', color: TEXT_PRIMARY, marginBottom: 8, letterSpacing: -1 },
  headerSubtitle: { fontSize: 15, color: TEXT_SECONDARY, lineHeight: 22, fontWeight: '500' },

  metricsScroll: { paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  metricPill: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, marginBottom: 0 },
  metricIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metricPillText: { fontSize: 15, fontWeight: '700', color: TEXT_PRIMARY },

  graphCard: { marginHorizontal: 24 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -0.5 },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  trendText: { fontSize: 13, fontWeight: '700', color: '#34C759' },
  graphSubtitle: { fontSize: 14, color: TEXT_SECONDARY, marginBottom: 24, fontWeight: '500' },
  graphContainer: { width: '100%', height: 160 },

  sliderCard: { marginHorizontal: 24 },
  sliderWrapper: { marginTop: 16, alignItems: 'center' },
  
  sliderContainer: { height: 350, borderRadius: 24, overflow: 'hidden', position: 'relative', backgroundColor: '#F2F2F7', borderWidth: 2, borderColor: '#FFF' },
  sliderImage: { height: 350, position: 'absolute', top: 0, left: 0 },
  sliderImageClipped: { height: 350, position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
  labelBoxLeft: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width:0, height:2 } },
  labelBoxRight: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width:0, height:2 } },
  labelText: { color: TEXT_PRIMARY, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
  sliderDivider: { position: 'absolute', top: 0, bottom: 0, width: 4, backgroundColor: '#FFF', marginLeft: -2, zIndex: 10, shadowColor: '#1C1C1E', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 4 },
  sliderThumb: { position: 'absolute', top: '50%', left: '50%', width: 44, height: 44, borderRadius: 22, backgroundColor: BRAND_PRIMARY, marginTop: -22, marginLeft: -22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF', shadowColor: BRAND_PRIMARY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
});
