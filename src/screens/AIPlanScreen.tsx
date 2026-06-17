import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, Sparkles, Droplets,
  Moon, Sun, Apple, Check, CheckCircle2,
  Zap, Dumbbell, Brain,
} from 'lucide-react-native';
import Animated, {
  FadeInDown, FadeIn,
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store/store';
import type { FaceExercise, WaterReminder } from '../store/planSlice';


// ─── Design Tokens ────────────────────────────────────────────────────────────
const IVORY  = '#F8F6F4';
const BEIGE  = '#E8DDD6';
const NUDE   = '#DCC7BC';
const DARK   = '#2A2421';
const MID    = '#5A4C44';
const MUTED  = '#8A7A71';
const ACCENT = '#8C776B';

// ─── Animated Card ────────────────────────────────────────────────────────────
function FadeCard({ children, style, delay = 0 }: {
  children: React.ReactNode; style?: any; delay?: number;
}) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    ty.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));
  }, [delay, opacity, ty]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: ty.value }] }));

  return (
    <Animated.View style={[styles.card, style, animStyle]}>
      <View style={styles.cardBg} />
      {children}
    </Animated.View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHead({ icon, title, color }: {
  icon: React.ReactNode; title: string; color: string;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ─── Meal Row ─────────────────────────────────────────────────────────────────
function MealRow({ label, items }: { label: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <View style={styles.mealRow}>
      <Text style={styles.mealLabel}>{label}</Text>
      <View style={styles.mealItems}>
        {items.map((item, i) => (
          <View key={i} style={styles.mealChip}>
            <Text style={styles.mealChipText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Water Timeline ───────────────────────────────────────────────────────────
function WaterTimeline({ reminders }: { reminders: WaterReminder[] }) {
  return (
    <View style={styles.timeline}>
      {reminders.map((r, i) => (
        <View key={i} style={styles.timelineRow}>
          <View style={styles.timelineDotWrap}>
            <View style={styles.timelineDot} />
            {i < reminders.length - 1 && <View style={styles.timelineLine} />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineTime}>{r.time}</Text>
            <Text style={styles.timelineAmount}>{r.amount}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Exercise Card ────────────────────────────────────────────────────────────
function ExerciseCard({ ex }: { ex: FaceExercise }) {
  const [expanded, setExpanded] = useState(false);
  const diffColor = ex.difficulty === 'Beginner' ? '#34C759'
    : ex.difficulty === 'Intermediate' ? '#FF9F0A' : '#FF453A';

  return (
    <TouchableOpacity
      style={styles.exerciseCard}
      activeOpacity={0.85}
      onPress={() => setExpanded(p => !p)}
    >
      <View style={styles.exerciseCardTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseName}>{ex.name}</Text>
          <View style={styles.exerciseMeta}>
            <View style={[styles.diffBadge, { backgroundColor: `${diffColor}18` }]}>
              <Text style={[styles.diffText, { color: diffColor }]}>{ex.difficulty}</Text>
            </View>
            <Text style={styles.exerciseDur}>⏱ {ex.duration}</Text>
            <Text style={styles.exerciseSets}>✕ {ex.sets} sets</Text>
          </View>
        </View>
        <Text style={{ fontSize: 18, color: MUTED }}>{expanded ? '▲' : '▼'}</Text>
      </View>
      {expanded && (
        <Text style={styles.exerciseInstructions}>{ex.instructions}</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Week Accordion ───────────────────────────────────────────────────────────
function WeekBlock({ week, exercises }: { week: string; exercises: FaceExercise[] }) {
  if (!exercises?.length) return null;
  return (
    <View style={styles.weekBlock}>
      <Text style={styles.weekLabel}>{week}</Text>
      {exercises.map((ex, i) => <ExerciseCard key={i} ex={ex} />)}
    </View>
  );
}

// ─── Routine Step ─────────────────────────────────────────────────────────────
function RoutineStep({ step, index }: { step: string; index: number }) {
  return (
    <View style={styles.routineStep}>
      <View style={styles.stepNum}>
        <Text style={styles.stepNumText}>{index + 1}</Text>
      </View>
      <Text style={styles.stepText}>{step}</Text>
    </View>
  );
}

// ─── Checklist Item ───────────────────────────────────────────────────────────
function CheckItem({ text, index }: { text: string; index: number }) {
  const [done, setDone] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.checkItem, done && styles.checkItemDone]}
      activeOpacity={0.8}
      onPress={() => setDone(p => !p)}
    >
      <View style={[styles.checkBox, done && styles.checkBoxDone]}>
        {done && <Check size={13} color="#FFF" />}
      </View>
      <Text style={[styles.checkText, done && styles.checkTextDone]}>{text}</Text>
    </TouchableOpacity>
  );
}

// ─── Score Ring (simple CSS-style) ───────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#34C759' : score >= 60 ? '#FF9F0A' : '#FF453A';
  const label = score >= 80 ? 'Great Shape!' : score >= 60 ? 'Good Progress' : 'Needs Work';

  return (
    <View style={styles.scoreRingWrap}>
      <View style={[styles.scoreRingOuter, { borderColor: `${color}30` }]}>
        <View style={[styles.scoreRingInner, { borderColor: color }]}>
          <Text style={[styles.scoreNum, { color }]}>{score}</Text>
          <Text style={styles.scoreOutOf}>/100</Text>
        </View>
      </View>
      <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function AIPlanScreen() {
  const insets = useSafeAreaInsets();
  const plan = useAppSelector((s: RootState) => s.plan.currentPlan);
  const faceResult = useAppSelector((s: RootState) => s.faceAnalysis.result);
  const user = useAppSelector((s: RootState) => s.onboarding);

  // ── No Plan Guard ──
  if (!plan) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <LinearGradient colors={[IVORY, BEIGE]} style={StyleSheet.absoluteFill} />
        <Brain size={48} color={MUTED} style={{ marginBottom: 16 }} />
        <Text style={styles.noPlanTitle}>No Plan Generated Yet</Text>
        <Text style={styles.noPlanSub}>
          Complete a face scan first to generate your personalized plan.
        </Text>
        <TouchableOpacity
          style={styles.noPlanBtn}
          onPress={() => router.push('/face-scan-guide')}
        >
          <LinearGradient colors={['#8C776B', '#635147']} style={styles.noPlanBtnGrad}>
            <Text style={styles.noPlanBtnText}>Start Face Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  const exercisePlan = plan.exercisePlan ?? plan.faceExercisePlan;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[IVORY, BEIGE, NUDE]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>

        {/* Nav */}
        <View style={[styles.topNav, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <ChevronLeft size={24} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>My AI Plan</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero ── */}
          <Animated.View entering={FadeInDown.duration(500)} style={styles.hero}>
            <View style={styles.heroBadge}>
              <Sparkles size={13} color="#FFF" />
              <Text style={styles.heroBadgeText}>Personalized for {user.name || 'You'}</Text>
            </View>
            <Text style={styles.heroTitle}>30-Day AI{'\n'}Transformation Plan</Text>
            <View style={styles.heroTags}>
              {[
                faceResult ? `${faceResult.faceShape} Face` : null,
                faceResult ? faceResult.skinType : null,
                user.foodPreference,
                ...((user.goals ?? []).slice(0, 2)),
              ].filter(Boolean).map((tag, i) => (
                <View key={i} style={styles.heroTag}>
                  <Check size={11} color="#34C759" />
                  <Text style={styles.heroTagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* ── Progress Summary ── */}
          {plan.progressSummary && (
            <FadeCard delay={80} style={[styles.section, { backgroundColor: 'rgba(255, 255, 255, 0.85)', borderColor: '#E8DDD6' }]}>
              <SectionHead icon={<Zap size={18} color="#FF9F0A" />} title="Progress Update" color="#FF9F0A" />
              <Text style={{ fontSize: 15, color: MID, lineHeight: 22 }}>{plan.progressSummary}</Text>
            </FadeCard>
          )}

          {/* ── Faceora Score ── */}
          <FadeCard delay={100} style={styles.section}>
            <SectionHead icon={<Sparkles size={18} color={ACCENT} />} title="Faceora Score" color={ACCENT} />
            <ScoreRing score={plan.faceoraScore ?? 75} />
            {faceResult && (
              <Text style={styles.scoreNote}>
                Based on your face analysis ({faceResult.overallFaceScore}/100) and current lifestyle habits.
              </Text>
            )}
          </FadeCard>

          {/* ── Diet Plan ── */}
          <FadeCard delay={150} style={styles.section}>
            <SectionHead icon={<Apple size={18} color="#e67e22" />} title="Diet Plan" color="#e67e22" />
            <MealRow label="🌅 Breakfast" items={plan.dietPlan?.breakfast} />
            <MealRow label="☀️ Lunch" items={plan.dietPlan?.lunch} />
            <MealRow label="🌙 Dinner" items={plan.dietPlan?.dinner} />
            <MealRow label="🍎 Snacks" items={plan.dietPlan?.snacks} />
          </FadeCard>

          {/* ── Water Plan ── */}
          <FadeCard delay={200} style={styles.section}>
            <SectionHead icon={<Droplets size={18} color="#3498db" />} title="Water Plan" color="#3498db" />
            <View style={styles.waterGoalRow}>
              <View style={styles.waterGoalBox}>
                <Text style={styles.waterGoalNum}>{plan.waterPlan?.dailyGoalLabel ?? `${((plan.waterPlan?.dailyGoal ?? 2500) / 1000).toFixed(1)}L`}</Text>
                <Text style={styles.waterGoalSub}>Daily Goal</Text>
              </View>
              <View style={styles.waterGoalBox}>
                <Text style={styles.waterGoalNum}>{plan.waterPlan?.reminders?.length ?? 0}</Text>
                <Text style={styles.waterGoalSub}>Reminders</Text>
              </View>
            </View>
            {plan.waterPlan?.reminders?.length > 0 && (
              <WaterTimeline reminders={plan.waterPlan.reminders} />
            )}
          </FadeCard>

          {/* ── Face Exercise Plan ── */}
          {exercisePlan && (
            <FadeCard delay={250} style={styles.section}>
              <SectionHead icon={<Dumbbell size={18} color="#9b59b6" />} title="Face Exercise Plan" color="#9b59b6" />
              <Text style={styles.exerciseHint}>Tap an exercise to see instructions</Text>
              <WeekBlock week="Week 1 — Foundation" exercises={exercisePlan.week1} />
              <WeekBlock week="Week 2 — Building" exercises={exercisePlan.week2} />
              <WeekBlock week="Week 3 — Intensity" exercises={exercisePlan.week3} />
              <WeekBlock week="Week 4 — Mastery" exercises={exercisePlan.week4} />
            </FadeCard>
          )}

          {/* ── Skin Care Plan ── */}
          <FadeCard delay={300} style={styles.section}>
            <SectionHead icon={<Sparkles size={18} color="#2ecc71" />} title="Skin Care Plan" color="#2ecc71" />

            {plan.skinCarePlan?.morning?.length > 0 && (
              <View style={styles.routineBlock}>
                <View style={styles.routineHeaderRow}>
                  <Sun size={16} color="#f39c12" />
                  <Text style={styles.routineTitle}>Morning Routine</Text>
                </View>
                {plan.skinCarePlan.morning.map((step, i) => (
                  <RoutineStep key={i} step={step} index={i} />
                ))}
              </View>
            )}

            {plan.skinCarePlan?.night?.length > 0 && (
              <>
                <View style={styles.routineDivider} />
                <View style={styles.routineBlock}>
                  <View style={styles.routineHeaderRow}>
                    <Moon size={16} color="#6c5ce7" />
                    <Text style={styles.routineTitle}>Night Routine</Text>
                  </View>
                  {plan.skinCarePlan.night.map((step, i) => (
                    <RoutineStep key={i} step={step} index={i} />
                  ))}
                </View>
              </>
            )}
          </FadeCard>

          {/* ── Sleep Plan ── */}
          <FadeCard delay={350} style={[styles.section, styles.sleepCard]}>
            <SectionHead
              icon={<Moon size={18} color="#FFF" />}
              title="Sleep Plan"
              color="#FFF"
            />
            <View style={styles.sleepStatsRow}>
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatNum}>{plan.sleepPlan?.targetHoursLabel ?? `${plan.sleepPlan?.targetHours ?? 8}h`}</Text>
                <Text style={styles.sleepStatLabel}>Target</Text>
              </View>
              <View style={styles.sleepStatDiv} />
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatNum}>{plan.sleepPlan?.idealSleepTime ?? '10:30 PM'}</Text>
                <Text style={styles.sleepStatLabel}>Bed Time</Text>
              </View>
              <View style={styles.sleepStatDiv} />
              <View style={styles.sleepStat}>
                <Text style={styles.sleepStatNum}>{plan.sleepPlan?.idealWakeTime ?? '6:00 AM'}</Text>
                <Text style={styles.sleepStatLabel}>Wake Time</Text>
              </View>
            </View>
            {plan.sleepPlan?.recommendations?.length > 0 && (
              <View style={styles.sleepRecs}>
                {plan.sleepPlan.recommendations.map((rec, i) => (
                  <View key={i} style={styles.sleepRec}>
                    <View style={styles.sleepRecDot} />
                    <Text style={styles.sleepRecText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </FadeCard>

          {/* ── Daily Checklist ── */}
          {plan.dailyChecklist?.length > 0 && (
            <FadeCard delay={400} style={styles.section}>
              <SectionHead icon={<CheckCircle2 size={18} color="#34C759" />} title="Daily Checklist" color="#34C759" />
              <Text style={styles.checklistHint}>Tap to check off tasks</Text>
              {plan.dailyChecklist.map((task, i) => (
                <CheckItem key={i} text={task} index={i} />
              ))}
            </FadeCard>
          )}

          {/* ── CTA ── */}
          <Animated.View entering={FadeIn.delay(600).duration(500)} style={styles.ctaSection}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.ctaBtn}
              onPress={() => router.replace('/(tabs)')}
            >
              <LinearGradient
                colors={['#8C776B', '#635147']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.ctaBtnGrad}
              >
                <Zap size={20} color="#FFF" />
                <Text style={styles.ctaBtnText}>Start My Plan Today</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ctaSecondary}
              onPress={() => router.push('/face-scan-guide')}
            >
              <Text style={styles.ctaSecondaryText}>Scan Again to Regenerate</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY },
  safeArea: { flex: 1 },

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

  scroll: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 64 },

  // Hero
  hero: { marginBottom: 24 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: DARK, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, alignSelf: 'flex-start', marginBottom: 14,
  },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: '#FFF' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: DARK, letterSpacing: -0.5, marginBottom: 16 },
  heroTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  heroTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  heroTagText: { fontSize: 12, fontWeight: '600', color: DARK },

  // Card
  card: {
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04, shadowRadius: 20, marginBottom: 16,
  },
  cardBg: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.62)' },
  section: { padding: 22 },

  // Section head
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  iconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: DARK },

  // Score
  scoreRingWrap: { alignItems: 'center', paddingVertical: 12 },
  scoreRingOuter: { width: 130, height: 130, borderRadius: 65, borderWidth: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  scoreRingInner: { width: 106, height: 106, borderRadius: 53, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  scoreOutOf: { fontSize: 14, color: MUTED, fontWeight: '500' },
  scoreLabel: { fontSize: 15, fontWeight: '700' },
  scoreNote: { fontSize: 13, color: MUTED, textAlign: 'center', marginTop: 8, lineHeight: 20 },

  // Diet
  mealRow: { marginBottom: 16 },
  mealLabel: { fontSize: 14, fontWeight: '700', color: MID, marginBottom: 8 },
  mealItems: { gap: 6 },
  mealChip: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  mealChipText: { fontSize: 14, color: MID, fontWeight: '500' },

  // Water
  waterGoalRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  waterGoalBox: {
    flex: 1, backgroundColor: 'rgba(52, 152, 219, 0.08)',
    borderRadius: 16, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(52, 152, 219, 0.15)',
  },
  waterGoalNum: { fontSize: 28, fontWeight: '800', color: '#3498db', marginBottom: 4 },
  waterGoalSub: { fontSize: 12, color: MUTED, fontWeight: '600', textTransform: 'uppercase' },

  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineDotWrap: { alignItems: 'center', width: 20 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3498db', marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(52, 152, 219, 0.2)', marginVertical: 2 },
  timelineContent: {
    flex: 1, flexDirection: 'row', justifyContent: 'space-between',
    paddingBottom: 16,
  },
  timelineTime: { fontSize: 14, fontWeight: '600', color: DARK },
  timelineAmount: { fontSize: 14, fontWeight: '700', color: '#3498db' },

  // Exercises
  exerciseHint: { fontSize: 12, color: MUTED, marginBottom: 14 },
  weekBlock: { marginBottom: 20 },
  weekLabel: { fontSize: 13, fontWeight: '700', color: MUTED, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  exerciseCard: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  exerciseCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  exerciseName: { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 8 },
  exerciseMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  diffText: { fontSize: 11, fontWeight: '700' },
  exerciseDur: { fontSize: 13, color: MUTED },
  exerciseSets: { fontSize: 13, color: MUTED },
  exerciseInstructions: { fontSize: 13, color: MID, lineHeight: 20, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)', paddingTop: 12 },

  // Skincare
  routineBlock: { paddingVertical: 4 },
  routineHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  routineTitle: { fontSize: 15, fontWeight: '700', color: DARK },
  routineStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  stepNumText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 14, color: MID, lineHeight: 21 },
  routineDivider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: 16 },

  // Sleep
  sleepCard: { backgroundColor: DARK },
  sleepStatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sleepStat: { flex: 1, alignItems: 'center' },
  sleepStatDiv: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
  sleepStatNum: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 4, textAlign: 'center' },
  sleepStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' },
  sleepRecs: { gap: 10 },
  sleepRec: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  sleepRecDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginTop: 7 },
  sleepRecText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },

  // Checklist
  checklistHint: { fontSize: 12, color: MUTED, marginBottom: 14 },
  checkItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)',
  },
  checkItemDone: { backgroundColor: 'rgba(52, 199, 89, 0.08)', borderColor: 'rgba(52, 199, 89, 0.2)' },
  checkBox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkBoxDone: { backgroundColor: '#34C759', borderColor: '#34C759' },
  checkText: { flex: 1, fontSize: 14, color: MID, fontWeight: '500' },
  checkTextDone: { color: MUTED, textDecorationLine: 'line-through' },

  // CTA
  ctaSection: { marginTop: 8, gap: 12 },
  ctaBtn: { height: 60, borderRadius: 30, overflow: 'hidden', shadowColor: ACCENT, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
  ctaBtnGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ctaBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  ctaSecondary: { paddingVertical: 12, alignItems: 'center' },
  ctaSecondaryText: { color: MUTED, fontSize: 14, fontWeight: '600' },

  // No plan
  noPlanTitle: { fontSize: 22, fontWeight: '700', color: DARK, marginBottom: 10 },
  noPlanSub: { fontSize: 14, color: MUTED, textAlign: 'center', marginHorizontal: 40, marginBottom: 32, lineHeight: 22 },
  noPlanBtn: { borderRadius: 28, overflow: 'hidden' },
  noPlanBtnGrad: { paddingHorizontal: 32, paddingVertical: 16 },
  noPlanBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
