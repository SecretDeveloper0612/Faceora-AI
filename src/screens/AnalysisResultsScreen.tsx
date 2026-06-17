import React, { useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, DimensionValue,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store/store';
import type { SkinConcern } from '../store/faceAnalysisSlice';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedProps,
  withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, Sparkles, CheckCircle2,
  Droplets, Activity, Smile, Brain,
  Shield, Zap, Clock, Star,
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const IVORY = '#F8F6F4';
const BEIGE = '#E8DDD6';
const NUDE  = '#DCC7BC';
const DARK  = '#2A2421';
const MID   = '#5A4C44';
const MUTED = '#8A7A71';
const ACCENT = '#8C776B';

// ─── Utility ──────────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 90) return '#34C759';
  if (score >= 75) return '#30B0C7';
  if (score >= 60) return '#FF9F0A';
  return '#FF453A';
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Average';
  return 'Needs Work';
}

function severityColor(severity: string) {
  if (severity === 'Low') return '#34C759';
  if (severity === 'Medium') return '#FF9F0A';
  return '#FF453A';
}

// ─── Animated Circle ─────────────────────────────────────────────────────────
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Progress Ring ────────────────────────────────────────────────────────────
function ProgressRing({ score, size, stroke, color, delay = 0 }: {
  score: number; size: number; stroke: number; color: string; delay?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const sv = useSharedValue(0);

  useEffect(() => {
    sv.value = withDelay(delay, withTiming(score, { duration: 1400, easing: Easing.out(Easing.exp) }));
  }, [score, sv, delay]);

  const animProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (sv.value / 100) * circumference,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke="rgba(0,0,0,0.06)" fill="none"
          cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke}
        />
        <AnimatedCircle
          stroke={color} fill="none"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animProps as any}
        />
      </Svg>
    </View>
  );
}

// ─── Animated Bar ─────────────────────────────────────────────────────────────
function ScoreBar({ label, score, color, delay }: {
  label: string; score: number; color: string; delay: number;
}) {
  const sv = useSharedValue(0);
  useEffect(() => {
    sv.value = withDelay(delay, withTiming(score, { duration: 1000, easing: Easing.out(Easing.exp) }));
  }, [score, sv, delay]);

  const barStyle = useAnimatedStyle(() => ({ width: `${sv.value}%` as DimensionValue }));

  return (
    <View style={styles.scoreBarWrap}>
      <View style={styles.scoreBarHeader}>
        <Text style={styles.scoreBarLabel}>{label}</Text>
        <Text style={[styles.scoreBarValue, { color }]}>{score}/100</Text>
      </View>
      <View style={styles.scoreBarTrack}>
        <Animated.View style={[styles.scoreBarFill, { backgroundColor: color }, barStyle]} />
      </View>
    </View>
  );
}

// ─── Glass Card ────────────────────────────────────────────────────────────────
function GlassCard({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardBg} />
      {children}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ─── Face Shape Info ──────────────────────────────────────────────────────────
const FACE_SHAPE_DESC: Record<string, string> = {
  Oval: 'Balanced proportions with a slightly wider forehead. The most versatile face shape.',
  Round: 'Soft, equal width and length with full cheeks and a rounded chin.',
  Diamond: 'High cheekbones with a narrow forehead and chin — considered rare and striking.',
  Square: 'Strong jaw and forehead with balanced width across the face.',
  Heart: 'Wide forehead tapering to a pointed chin, often associated with high cheekbones.',
  Rectangle: 'Longer face with even width throughout — also called oblong.',
  Oblong: 'Similar to rectangle — elongated face with high forehead and long jaw.',
};

const SKIN_TYPE_DESC: Record<string, string> = {
  Dry: 'Low sebum production causing tightness and flakiness. Focus on rich moisturizers.',
  Oily: 'Excess sebum production giving a shiny appearance. Benefits from gentle cleansing.',
  Combination: 'Oily in the T-zone (forehead, nose, chin) with normal or dry cheeks.',
  Sensitive: 'Prone to redness and irritation. Needs gentle, fragrance-free products.',
  Normal: 'Well-balanced sebum with few imperfections and minimal sensitivity.',
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function AnalysisResultsScreen({ onBack }: { onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const result = useAppSelector((s: RootState) => s.faceAnalysis.result);

  const headerOpacity = useSharedValue(0);
  const headerSlide = useSharedValue(24);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) });
    headerSlide.value = withTiming(0, { duration: 700, easing: Easing.out(Easing.exp) });
  }, [headerOpacity, headerSlide]);

  const headerAnim = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerSlide.value }],
  }));

  // ── No Data Guard ──
  if (!result) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <LinearGradient colors={[IVORY, BEIGE]} style={StyleSheet.absoluteFill} />
        <Brain size={48} color={MUTED} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 18, fontWeight: '700', color: DARK, marginBottom: 8 }}>
          No Analysis Yet
        </Text>
        <Text style={{ fontSize: 14, color: MUTED, textAlign: 'center', marginHorizontal: 40, marginBottom: 32 }}>
          Complete a face scan to see your results here.
        </Text>
        <TouchableOpacity style={styles.noDataBtn} onPress={() => router.replace('/face-scan-guide')}>
          <LinearGradient colors={['#8C776B', '#635147']} style={styles.noDataBtnGrad}>
            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '700' }}>Start Face Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const mainColor = scoreColor(result.overallFaceScore);
  const faceShapeDesc = FACE_SHAPE_DESC[result.faceShape] ?? 'A balanced facial structure with unique characteristics.';
  const skinTypeDesc = SKIN_TYPE_DESC[result.skinType] ?? 'Your skin type has unique characteristics.';

  // ── Floating background particles ──
  const particles = Array.from({ length: 14 }).map((_, i) => ({
    top: `${(Math.sin(i * 321) * 0.5 + 0.5) * 100}%` as DimensionValue,
    left: `${(Math.cos(i * 123) * 0.5 + 0.5) * 100}%` as DimensionValue,
    size: (Math.sin(i * 213) * 0.5 + 0.5) * 5 + 2,
    opacity: (Math.sin(i * 312) * 0.5 + 0.5) * 0.25 + 0.04,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient colors={[IVORY, BEIGE, NUDE]} style={StyleSheet.absoluteFill} />

      {/* Particles */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {particles.map((p, i) => (
          <View key={i} style={[styles.particle, {
            top: p.top, left: p.left,
            width: p.size, height: p.size, opacity: p.opacity,
          }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>

        {/* Top Nav */}
        <View style={[styles.topNav, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => { if (onBack) onBack(); else router.back(); }}
          >
            <ChevronLeft size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>AI Face Analysis</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <Animated.View style={[styles.pageHeader, headerAnim]}>
            <Text style={styles.pageTitle}>Your Face Report</Text>
            <Text style={styles.pageDate}>
              {result.createdAt
                ? new Date(result.createdAt).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })
                : 'Today'}
            </Text>
          </Animated.View>

          {/* ── Hero Score Card ── */}
          <GlassCard style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroEyebrow}>Faceora Score</Text>
                <Text style={[styles.heroScore, { color: mainColor }]}>
                  {result.overallFaceScore}
                  <Text style={styles.heroScoreOut}>/100</Text>
                </Text>
                <View style={[styles.scoreLabelBadge, { backgroundColor: `${mainColor}18` }]}>
                  <View style={[styles.scoreDot, { backgroundColor: mainColor }]} />
                  <Text style={[styles.scoreLabelText, { color: mainColor }]}>
                    {scoreLabel(result.overallFaceScore)}
                  </Text>
                </View>
              </View>
              <View style={styles.heroRingWrap}>
                <ProgressRing
                  score={result.overallFaceScore}
                  size={120} stroke={10}
                  color={mainColor}
                />
                <Text style={[styles.heroRingCenter, { color: mainColor }]}>
                  {result.overallFaceScore}
                </Text>
              </View>
            </View>

            {/* Quick stats row */}
            <View style={styles.quickStats}>
              <View style={styles.quickStat}>
                <Clock size={14} color={MUTED} />
                <Text style={styles.quickStatLabel}>Face Age</Text>
                <Text style={styles.quickStatValue}>{result.estimatedFaceAge}y</Text>
              </View>
              <View style={styles.quickStatDiv} />
              <View style={styles.quickStat}>
                <Smile size={14} color={MUTED} />
                <Text style={styles.quickStatLabel}>Face Shape</Text>
                <Text style={styles.quickStatValue}>{result.faceShape}</Text>
              </View>
              <View style={styles.quickStatDiv} />
              <View style={styles.quickStat}>
                <Droplets size={14} color={MUTED} />
                <Text style={styles.quickStatLabel}>Skin Type</Text>
                <Text style={styles.quickStatValue}>{result.skinType}</Text>
              </View>
            </View>
          </GlassCard>

          {/* ── Score Breakdown ── */}
          <GlassCard style={styles.section}>
            <SectionHeader icon={<Activity size={18} color={ACCENT} />} title="Health Breakdown" />
            <ScoreBar label="Skin Health" score={result.scores.skinHealth} color={scoreColor(result.scores.skinHealth)} delay={200} />
            <ScoreBar label="Hydration" score={result.scores.hydration} color={scoreColor(result.scores.hydration)} delay={300} />
            <ScoreBar label="Symmetry" score={result.scores.symmetry} color={scoreColor(result.scores.symmetry)} delay={400} />
            <ScoreBar label="Jawline" score={result.scores.jawline} color={scoreColor(result.scores.jawline)} delay={500} />
            <ScoreBar label="Aging" score={result.scores.aging} color={scoreColor(result.scores.aging)} delay={600} />
          </GlassCard>

          {/* ── Face Shape ── */}
          <GlassCard style={styles.section}>
            <SectionHeader icon={<Smile size={18} color={ACCENT} />} title="Face Shape" />
            <View style={styles.detectChip}>
              <Text style={styles.detectChipText}>{result.faceShape}</Text>
            </View>
            <Text style={styles.detectDesc}>{faceShapeDesc}</Text>
          </GlassCard>

          {/* ── Skin Type ── */}
          <GlassCard style={styles.section}>
            <SectionHeader icon={<Droplets size={18} color={ACCENT} />} title="Skin Type" />
            <View style={styles.detectChip}>
              <Text style={styles.detectChipText}>{result.skinType}</Text>
            </View>
            <Text style={styles.detectDesc}>{skinTypeDesc}</Text>
          </GlassCard>

          {/* ── Estimated Face Age ── */}
          <GlassCard style={styles.section}>
            <SectionHeader icon={<Clock size={18} color={ACCENT} />} title="Estimated Facial Age" />
            <View style={styles.ageRow}>
              <Text style={styles.ageBig}>{result.estimatedFaceAge}</Text>
              <Text style={styles.ageUnit}>Years</Text>
            </View>
            <Text style={styles.detectDesc}>
              Based on visible skin condition, texture, and elasticity indicators.
              This is a cosmetic estimate, not a medical assessment.
            </Text>
          </GlassCard>

          {/* ── Skin Concerns ── */}
          {result.concerns.length > 0 && (
            <GlassCard style={styles.section}>
              <SectionHeader icon={<Shield size={18} color={ACCENT} />} title="Skin Concerns" />
              {result.concerns.map((concern: SkinConcern, i: number) => (
                <View key={i} style={styles.concernRow}>
                  <View style={styles.concernLeft}>
                    <Text style={styles.concernName}>{concern.name}</Text>
                    <View style={styles.concernMeta}>
                      <View style={[styles.severityBadge, { backgroundColor: `${severityColor(concern.severity)}18` }]}>
                        <Text style={[styles.severityText, { color: severityColor(concern.severity) }]}>
                          {concern.severity}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.concernRight}>
                    <Text style={styles.confidenceNum}>{concern.confidence}%</Text>
                    <Text style={styles.confidenceLabel}>Confidence</Text>
                  </View>
                </View>
              ))}
            </GlassCard>
          )}

          {/* ── Positive Features ── */}
          {result.positiveFeatures.length > 0 && (
            <GlassCard style={styles.section}>
              <SectionHeader icon={<Star size={18} color={ACCENT} />} title="Positive Features" />
              {result.positiveFeatures.map((feature: string, i: number) => (
                <View key={i} style={styles.positiveRow}>
                  <CheckCircle2 size={18} color="#34C759" />
                  <Text style={styles.positiveText}>{feature}</Text>
                </View>
              ))}
            </GlassCard>
          )}

          {/* ── Recommendations ── */}
          {result.recommendations.length > 0 && (
            <GlassCard style={styles.section}>
              <SectionHeader icon={<Zap size={18} color={ACCENT} />} title="Recommendations" />
              {result.recommendations.map((rec: string, i: number) => (
                <View key={i} style={styles.recRow}>
                  <View style={styles.recNum}>
                    <Text style={styles.recNumText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.recText}>{rec}</Text>
                </View>
              ))}
            </GlassCard>
          )}

          {/* ── CTA Buttons ── */}
          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={styles.ctaPrimary}
              activeOpacity={0.85}
              onPress={() => router.push('/plan-generation')}
            >
              <LinearGradient
                colors={['#8C776B', '#635147']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.ctaPrimaryGrad}
              >
                <Sparkles size={20} color="#FFF" />
                <Text style={styles.ctaPrimaryText}>Create My Skin Plan</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ctaSecondary}
              onPress={() => { if (onBack) onBack(); else router.push('/face-scan-guide'); }}
            >
              <Text style={styles.ctaSecondaryText}>Scan Again</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY },
  safeArea: { flex: 1 },
  particle: {
    position: 'absolute', backgroundColor: ACCENT, borderRadius: 10,
  },

  topNav: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.35)',
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center', justifyContent: 'center',
  },
  navTitle: { fontSize: 17, fontWeight: '700', color: DARK },

  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 64 },

  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 30, fontWeight: '800', color: DARK, letterSpacing: -0.5, marginBottom: 4 },
  pageDate: { fontSize: 13, color: MUTED, fontWeight: '500' },

  // Card
  card: {
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04, shadowRadius: 20, marginBottom: 16,
  },
  cardBg: { ...StyleSheet.absoluteFill as any, backgroundColor: 'rgba(255,255,255,0.62)' },

  // Hero
  heroCard: { padding: 24 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  heroLeft: { flex: 1 },
  heroEyebrow: { fontSize: 12, fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  heroScore: { fontSize: 58, fontWeight: '800', letterSpacing: -2, lineHeight: 64 },
  heroScoreOut: { fontSize: 22, fontWeight: '500', color: MUTED },
  heroRingWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  heroRingCenter: { position: 'absolute', fontSize: 26, fontWeight: '800' },
  scoreLabelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, marginTop: 10,
  },
  scoreDot: { width: 7, height: 7, borderRadius: 4 },
  scoreLabelText: { fontSize: 13, fontWeight: '700' },

  quickStats: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: 16,
  },
  quickStat: { flex: 1, alignItems: 'center', gap: 4 },
  quickStatDiv: { width: 1, height: 32, backgroundColor: 'rgba(0,0,0,0.08)' },
  quickStatLabel: { fontSize: 10, color: MUTED, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  quickStatValue: { fontSize: 15, fontWeight: '700', color: DARK },

  // Section
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: DARK },

  // Score bars
  scoreBarWrap: { marginBottom: 14 },
  scoreBarHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  scoreBarLabel: { fontSize: 14, fontWeight: '500', color: MID },
  scoreBarValue: { fontSize: 14, fontWeight: '700' },
  scoreBarTrack: { height: 8, backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 4 },

  // Detect
  detectChip: {
    alignSelf: 'flex-start', backgroundColor: DARK,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12,
  },
  detectChipText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  detectDesc: { fontSize: 14, color: MUTED, lineHeight: 21 },

  // Age
  ageRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 12 },
  ageBig: { fontSize: 48, fontWeight: '800', color: DARK, letterSpacing: -1 },
  ageUnit: { fontSize: 20, fontWeight: '600', color: MUTED },

  // Concerns
  concernRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  concernLeft: { flex: 1 },
  concernName: { fontSize: 15, fontWeight: '600', color: DARK, marginBottom: 6 },
  concernMeta: { flexDirection: 'row', gap: 8 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  severityText: { fontSize: 12, fontWeight: '700' },
  concernRight: { alignItems: 'flex-end' },
  confidenceNum: { fontSize: 22, fontWeight: '800', color: DARK },
  confidenceLabel: { fontSize: 10, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },

  // Positives
  positiveRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  positiveText: { flex: 1, fontSize: 14, color: MID, lineHeight: 20, fontWeight: '500' },

  // Recommendations
  recRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  recNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  recNumText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  recText: { flex: 1, fontSize: 14, color: MID, lineHeight: 21, fontWeight: '500' },

  // CTA
  ctaSection: { marginTop: 8, gap: 12 },
  ctaPrimary: {
    height: 60, borderRadius: 30, overflow: 'hidden',
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16,
  },
  ctaPrimaryGrad: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaPrimaryText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  ctaSecondary: { paddingVertical: 14, alignItems: 'center' },
  ctaSecondaryText: { color: MUTED, fontSize: 15, fontWeight: '600' },

  // No data
  noDataBtn: { borderRadius: 28, overflow: 'hidden' },
  noDataBtnGrad: { paddingHorizontal: 32, paddingVertical: 16 },
});
