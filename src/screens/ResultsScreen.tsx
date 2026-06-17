import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, DimensionValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { 
  ChevronLeft, Sparkles, Droplets, AlertTriangle, Eye, Activity, 
  ChevronRight, CheckCircle2, ShieldCheck, ArrowUpRight, Lightbulb
} from 'lucide-react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#DCC7BC'; 

// Reusable Glass Card
const GlassCard = ({ children, style }: any) => (
  <View style={[styles.glassCard, style]}>
    <View style={styles.glassCardBackground} />
    {children}
  </View>
);

// Progress Ring
const ProgressRing = ({ progress, size, strokeWidth, color }: { progress: number, size: number, strokeWidth: number, color: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const animatedProgress = useSharedValue(0);
  
  useEffect(() => {
    animatedProgress.value = withDelay(400, withTiming(progress, { duration: 1500, easing: Easing.out(Easing.exp) }));
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animatedProgress.value / 100) * circumference
  }));
  
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle stroke="rgba(255,255,255,0.3)" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <AnimatedCircle 
          stroke={color} fill="none" cx={size / 2} cy={size / 2} r={radius} 
          strokeWidth={strokeWidth} strokeDasharray={circumference} strokeLinecap="round" 
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animatedProps as any} 
        />
      </Svg>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ResultsScreen({ onBack, onViewFull, onScanAgain }: { onBack?: () => void, onViewFull?: () => void, onScanAgain?: () => void }) {
  const entranceOpacity = useSharedValue(0);
  const entranceTranslateY = useSharedValue(20);

  useEffect(() => {
    entranceOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    entranceTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });
  }, []);

  const animatedEntrance = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceTranslateY.value }]
  }));

  const particles = Array.from({ length: 15 }).map((_, i) => ({
    top: `${(Math.sin(i * 321) * 0.5 + 0.5) * 100}%` as DimensionValue,
    left: `${(Math.cos(i * 123) * 0.5 + 0.5) * 100}%` as DimensionValue,
    size: (Math.sin(i * 213) * 0.5 + 0.5) * 6 + 2,
    opacity: (Math.sin(i * 312) * 0.5 + 0.5) * 0.3 + 0.05,
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
        
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ChevronLeft size={24} color="#2A2421" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Success Header */}
          <Animated.View style={[styles.successHeader, animatedEntrance]}>
            <View style={styles.successIconWrapper}>
              <CheckCircle2 size={32} color="#34C759" />
              <View style={styles.successGlow} />
            </View>
            <Text style={styles.successTitle}>Analysis Complete</Text>
          </Animated.View>

          {/* Hero Results Card */}
          <Animated.View style={[animatedEntrance, { marginTop: 32 }]}>
            <GlassCard style={styles.heroCard}>
              <Text style={styles.heroTitle}>Your Skin Results</Text>
              <View style={styles.heroContent}>
                <View style={styles.heroRingWrapper}>
                  <ProgressRing progress={92} size={140} strokeWidth={12} color="#34C759" />
                  <View style={styles.heroRingInner}>
                    <Text style={styles.scoreBig}>92</Text>
                    <Text style={styles.scoreOut}>/ 100</Text>
                  </View>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Sparkles size={16} color="#34C759" />
                <Text style={styles.statusText}>Excellent</Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Skin Snapshot & Preview Row */}
          <Animated.View style={[styles.snapshotRow, animatedEntrance]}>
            <GlassCard style={styles.snapshotCard}>
              <View style={styles.snapshotIconBox}>
                <Sparkles size={16} color="#8C776B" />
              </View>
              <Text style={styles.snapshotText}>Your skin appears healthy with excellent hydration and minimal acne activity.</Text>
            </GlassCard>
            
            <View style={styles.previewContainer}>
              <View style={styles.previewGlow} />
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=47' }} style={styles.previewImage} />
              <View style={styles.previewBadge}>
                <CheckCircle2 size={10} color="#FFF" />
                <Text style={styles.previewBadgeText}>Verified</Text>
              </View>
            </View>
          </Animated.View>

          {/* Key Findings */}
          <Animated.View style={[animatedEntrance, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>Key Findings</Text>
            <View style={styles.metricsGrid}>
              
              <GlassCard style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Droplets size={20} color="#3498db" />
                  <Text style={styles.metricValue}>87%</Text>
                </View>
                <Text style={styles.metricLabel}>Hydration</Text>
                <Text style={[styles.metricStatus, { color: '#3498db' }]}>Excellent</Text>
              </GlassCard>

              <GlassCard style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <AlertTriangle size={20} color="#2ecc71" />
                  <Text style={styles.metricValue}>Low</Text>
                </View>
                <Text style={styles.metricLabel}>Acne Risk</Text>
                <Text style={[styles.metricStatus, { color: '#2ecc71' }]}>Healthy</Text>
              </GlassCard>

              <GlassCard style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Eye size={20} color="#f1c40f" />
                  <Text style={styles.metricValue}>Mild</Text>
                </View>
                <Text style={styles.metricLabel}>Dark Circles</Text>
                <Text style={[styles.metricStatus, { color: '#e67e22' }]}>Minor Attention</Text>
              </GlassCard>

              <GlassCard style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Activity size={20} color="#9b59b6" />
                  <Text style={styles.metricValue}>91%</Text>
                </View>
                <Text style={styles.metricLabel}>Skin Texture</Text>
                <Text style={[styles.metricStatus, { color: '#9b59b6' }]}>Excellent</Text>
              </GlassCard>
              
            </View>
          </Animated.View>

          {/* Strengths & Improvements */}
          <Animated.View style={[animatedEntrance, { marginTop: 32 }]}>
            <GlassCard style={styles.listCard}>
              <Text style={styles.listCardTitle}>Your Skin Strengths</Text>
              <View style={styles.listItem}>
                <CheckCircle2 size={16} color="#34C759" />
                <Text style={styles.listText}>Strong Hydration</Text>
              </View>
              <View style={styles.listItem}>
                <CheckCircle2 size={16} color="#34C759" />
                <Text style={styles.listText}>Healthy Skin Texture</Text>
              </View>
              <View style={styles.listItem}>
                <CheckCircle2 size={16} color="#34C759" />
                <Text style={styles.listText}>Minimal Wrinkles</Text>
              </View>
            </GlassCard>

            <GlassCard style={[styles.listCard, { marginTop: 16 }]}>
              <Text style={styles.listCardTitle}>Improvement Opportunities</Text>
              <View style={styles.listItem}>
                <ArrowUpRight size={16} color="#e67e22" />
                <Text style={styles.listText}>Increase Daily Hydration</Text>
              </View>
              <View style={styles.listItem}>
                <ArrowUpRight size={16} color="#e67e22" />
                <Text style={styles.listText}>Improve Sleep Recovery</Text>
              </View>
              <View style={styles.listItem}>
                <ArrowUpRight size={16} color="#e67e22" />
                <Text style={styles.listText}>Use Daily SPF Protection</Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* AI Insight */}
          <Animated.View style={[animatedEntrance, { marginTop: 32 }]}>
            <GlassCard style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Lightbulb size={20} color="#f1c40f" />
                <Text style={styles.insightTitle}>AI Insight</Text>
              </View>
              <Text style={styles.insightText}>Your skin is performing better than average for your age group. Consistent hydration and UV protection could further improve your results.</Text>
            </GlassCard>
          </Animated.View>

          {/* Progress Potential */}
          <Animated.View style={[animatedEntrance, { marginTop: 32 }]}>
            <Text style={styles.sectionTitle}>Potential Score After 30 Days</Text>
            <GlassCard style={styles.potentialCard}>
              <View style={styles.potentialRow}>
                <View style={styles.potentialBox}>
                  <Text style={styles.potentialLabel}>Current Score</Text>
                  <Text style={styles.potentialValue}>92</Text>
                </View>
                <ArrowUpRight size={32} color="#34C759" style={{ opacity: 0.5 }} />
                <View style={styles.potentialBox}>
                  <Text style={styles.potentialLabel}>Projected Score</Text>
                  <Text style={[styles.potentialValue, { color: '#34C759' }]}>96</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View style={[animatedEntrance, { marginTop: 40, gap: 16 }]}>
            <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtn} onPress={onViewFull}>
              <LinearGradient colors={['#8C776B', '#635147']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.primaryGrad}>
                <Text style={styles.primaryBtnText}>View Full Analysis</Text>
                <ChevronRight size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
              <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 30 }]} />
              <Text style={styles.secondaryBtnText}>Create My Skin Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tertiaryBtn} onPress={onScanAgain}>
              <Text style={styles.tertiaryBtnText}>Scan Again</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Confidence Meter */}
          <Animated.View style={[animatedEntrance, { marginTop: 40, marginBottom: 20, alignItems: 'center' }]}>
            <View style={styles.confidenceBadge}>
              <ShieldCheck size={16} color="#8C776B" />
              <Text style={styles.confidenceText}>Analysis Confidence: 98%</Text>
            </View>
            <Text style={styles.confidenceSub}>Results generated using advanced AI facial analysis.</Text>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  safeArea: { flex: 1 },
  particle: {
    position: 'absolute', backgroundColor: '#FFF', borderRadius: 10,
    shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6,
  },
  
  glassCard: {
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 20,
  },
  glassCardBackground: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },

  topNav: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
  
  successHeader: { alignItems: 'center', marginTop: 10 },
  successIconWrapper: { position: 'relative', width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(52, 199, 89, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successGlow: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: '#34C759', opacity: 0.3 },
  successTitle: { fontSize: 22, fontWeight: '700', color: '#2A2421' },

  heroCard: { padding: 30, alignItems: 'center' },
  heroTitle: { fontSize: 18, color: '#6A5F58', fontWeight: '600', marginBottom: 24 },
  heroContent: { alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  heroRingWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  heroRingInner: { position: 'absolute', alignItems: 'baseline', flexDirection: 'row' },
  scoreBig: { fontSize: 64, fontWeight: '700', color: '#2A2421', letterSpacing: -2 },
  scoreOut: { fontSize: 20, fontWeight: '600', color: '#8A7A71', marginLeft: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(52, 199, 89, 0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  statusText: { fontSize: 15, fontWeight: '600', color: '#34C759' },

  snapshotRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 24 },
  snapshotCard: { flex: 1, padding: 16 },
  snapshotIconBox: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(140, 119, 107, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  snapshotText: { fontSize: 13, color: '#5A4C44', lineHeight: 20 },
  previewContainer: { position: 'relative', width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  previewGlow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 2, borderColor: '#FFF' },
  previewImage: { width: 90, height: 90, borderRadius: 45, zIndex: 2 },
  previewBadge: { position: 'absolute', bottom: -6, backgroundColor: '#34C759', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, zIndex: 3, borderWidth: 1, borderColor: '#FFF' },
  previewBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#2A2421', marginBottom: 16 },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: (width - 52) / 2, padding: 16 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  metricValue: { fontSize: 22, fontWeight: '700', color: '#2A2421' },
  metricLabel: { fontSize: 14, color: '#5A4C44', fontWeight: '600', marginBottom: 4 },
  metricStatus: { fontSize: 12, fontWeight: '600' },

  listCard: { padding: 20 },
  listCardTitle: { fontSize: 16, fontWeight: '700', color: '#2A2421', marginBottom: 16 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  listText: { fontSize: 14, color: '#5A4C44', fontWeight: '500' },

  insightCard: { padding: 20, backgroundColor: 'rgba(255,255,255,0.8)' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  insightTitle: { fontSize: 15, fontWeight: '700', color: '#2A2421' },
  insightText: { fontSize: 14, color: '#5A4C44', lineHeight: 22 },

  potentialCard: { padding: 24 },
  potentialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  potentialBox: { alignItems: 'center' },
  potentialLabel: { fontSize: 13, color: '#8A7A71', fontWeight: '500', marginBottom: 8 },
  potentialValue: { fontSize: 36, fontWeight: '700', color: '#2A2421' },

  primaryBtn: { width: '100%', height: 60, borderRadius: 30, overflow: 'hidden', shadowColor: '#8C776B', shadowOffset: {width:0, height:8}, shadowOpacity: 0.3, shadowRadius: 16 },
  primaryGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  
  secondaryBtn: { width: '100%', height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)' },
  secondaryBtnText: { color: '#5A4C44', fontSize: 16, fontWeight: '600' },
  
  tertiaryBtn: { paddingVertical: 12, alignItems: 'center' },
  tertiaryBtnText: { color: '#8A7A71', fontSize: 15, fontWeight: '600' },

  confidenceBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 8 },
  confidenceText: { fontSize: 13, fontWeight: '600', color: '#5A4C44' },
  confidenceSub: { fontSize: 12, color: '#8A7A71' }
});
