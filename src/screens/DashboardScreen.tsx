import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, ScanFace, Droplets, Moon, Activity, 
  Lightbulb, Check
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addWater, toggleChecklistItem, completeExercise } from '../store/dashboardSlice';

const { width } = Dimensions.get('window');

// Ultra-Clean Light Mode Colors
const BG_GRADIENT_START = '#FDFCFB';
const BG_GRADIENT_END = '#E2D1C3';
const CARD_BG = '#FFFFFF';
const TEXT_PRIMARY = '#1C1C1E';
const TEXT_SECONDARY = '#8A8A8E';
const BRAND_PRIMARY = '#8C776B';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Modern Glass Card with Soft Floating Shadow
const FloatingCard = ({ children, style }: any) => (
  <View style={[styles.floatingCard, style]}>
    {children}
  </View>
);

const PremiumProgressRing = ({ progress, size, strokeWidth, color }: { progress: number, size: number, strokeWidth: number, color: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;
  
  return (
    <View style={{ 
      width: size, height: size, alignItems: 'center', justifyContent: 'center',
      shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 8 
    }}>
      <Svg width={size} height={size}>
        <Circle stroke="#F2F2F7" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <Circle 
          stroke={color} 
          fill="none" 
          cx={size / 2} 
          cy={size / 2} 
          r={radius} 
          strokeWidth={strokeWidth} 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
          transform={`rotate(-90 ${size / 2} ${size / 2})`} 
        />
      </Svg>
    </View>
  );
};

// Interactive Checklist Item
const ChecklistItem = ({ title, isActive, onPress }: { title: string, isActive: boolean, onPress: () => void }) => {
  const scale = useSharedValue(isActive ? 0.98 : 1);
  
  useEffect(() => {
    scale.value = withTiming(isActive ? 0.98 : 1, { duration: 200 });
  }, [isActive, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isActive ? '#E8F5E9' : '#F2F2F7',
      borderColor: isActive ? '#34C759' : 'transparent',
    };
  });

  return (
    <AnimatedTouchableOpacity 
      style={[styles.checklistItem, animatedStyle]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.checkboxOutline, isActive && styles.checkboxActive]}>
        {isActive && <Check size={14} color="#FFF" strokeWidth={3} />}
      </View>
      <Text style={[styles.checklistText, isActive && styles.checklistTextActive]}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const dashboard = useSelector((state: RootState) => state.dashboard);
  const user = useSelector((state: RootState) => state.onboarding);
  const userMeta = useSelector((state: RootState) => state.user);

  const entranceOpacity = useSharedValue(0);
  const entranceTranslateY = useSharedValue(20);

  useEffect(() => {
    entranceOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    entranceTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });
  }, [entranceOpacity, entranceTranslateY]);

  const animatedEntrance = useAnimatedStyle(() => ({
    opacity: entranceOpacity.value,
    transform: [{ translateY: entranceTranslateY.value }]
  }));

  const getFaceoraColor = (score: number) => {
    if (score >= 90) return '#34C759'; // Green
    if (score >= 75) return '#007AFF'; // Blue
    if (score >= 60) return '#FF9500'; // Orange
    return '#FF3B30'; // Red
  };

  const faceoraColor = getFaceoraColor(dashboard.faceoraScore);

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
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 20) }]} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <Animated.View style={[styles.header, animatedEntrance]}>
            <View>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>{user.name || 'Beautiful'} ✨</Text>
              
              <View style={styles.streakContainer}>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeText}>🔥 {dashboard.streak} Day Streak</Text>
                </View>
                <Text style={styles.streakSubtitle}>Day {dashboard.transformationDay} of Transformation</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.notificationBtn} onPress={() => router.push('/notifications' as any)}>
              <Bell size={22} color={TEXT_PRIMARY} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Section: Faceora Score */}
          <Animated.View style={[animatedEntrance, { marginTop: 24 }]}>
            <FloatingCard style={styles.heroCard}>
              <View style={styles.heroCardContent}>
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroLabel}>Faceora Score</Text>
                  <Text style={styles.heroTrendText}>
                    <Text style={{ color: dashboard.faceoraScoreTrend >= 0 ? '#34C759' : '#FF3B30' }}>
                      {dashboard.faceoraScoreTrend >= 0 ? '↑' : '↓'} {Math.abs(dashboard.faceoraScoreTrend)}
                    </Text> since last scan
                  </Text>
                  <TouchableOpacity onPress={() => router.push('/analysis-results' as any)} style={styles.viewAnalysisBtn}>
                    <Text style={styles.viewAnalysisText}>View Full Analysis</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.heroRingContainer}>
                  <PremiumProgressRing progress={dashboard.faceoraScore} size={110} strokeWidth={12} color={faceoraColor} />
                  <View style={styles.heroScoreInner}>
                    <Text style={styles.heroScoreValue}>{dashboard.faceoraScore}</Text>
                  </View>
                </View>
              </View>
            </FloatingCard>
          </Animated.View>

          {/* Daily Checklist */}
          <Animated.View style={[animatedEntrance, { marginTop: 24 }]}>
            <Text style={styles.sectionHeader}>Daily Goals</Text>
            <View style={styles.checklistContainer}>
              <ChecklistItem 
                title="Drink Water Goal" 
                isActive={dashboard.dailyChecklist.water} 
                onPress={() => dispatch(toggleChecklistItem('water'))} 
              />
              <ChecklistItem 
                title="Morning Face Wash" 
                isActive={dashboard.dailyChecklist.morningWash} 
                onPress={() => dispatch(toggleChecklistItem('morningWash'))} 
              />
              <ChecklistItem 
                title="Face Exercise" 
                isActive={dashboard.dailyChecklist.faceExercise} 
                onPress={() => dispatch(toggleChecklistItem('faceExercise'))} 
              />
              <ChecklistItem 
                title="Healthy Meal" 
                isActive={dashboard.dailyChecklist.healthyMeal} 
                onPress={() => dispatch(toggleChecklistItem('healthyMeal'))} 
              />
              <ChecklistItem 
                title="Sleep Target" 
                isActive={dashboard.dailyChecklist.sleepGoal} 
                onPress={() => dispatch(toggleChecklistItem('sleepGoal'))} 
              />
            </View>
          </Animated.View>

          {/* Actionable Metrics Grid */}
          <Animated.View style={[animatedEntrance, { marginTop: 24 }]}>
            <Text style={styles.sectionHeader}>Activity</Text>
            <View style={styles.metricsGrid}>
              
              {/* Water Card */}
              <FloatingCard style={styles.metricCard}>
                <View style={styles.metricHeaderRow}>
                  <View style={[styles.metricIconWrap, { backgroundColor: '#E3F2FD' }]}>
                    <Droplets size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.metricTitle}>Water</Text>
                </View>
                <Text style={styles.metricValue}>{dashboard.waterProgress.toFixed(1)}<Text style={styles.metricUnit}>/{dashboard.waterGoal.toFixed(1)}L</Text></Text>
                
                <View style={styles.metricActionRow}>
                  <TouchableOpacity style={styles.metricAddBtn} onPress={() => dispatch(addWater(0.25))}>
                    <Text style={styles.metricAddText}>+250ml</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.metricAddBtn} onPress={() => dispatch(addWater(0.5))}>
                    <Text style={styles.metricAddText}>+500ml</Text>
                  </TouchableOpacity>
                </View>
              </FloatingCard>

              {/* Sleep Card */}
              <FloatingCard style={styles.metricCard}>
                <View style={styles.metricHeaderRow}>
                  <View style={[styles.metricIconWrap, { backgroundColor: '#F4EBFF' }]}>
                    <Moon size={20} color="#8A2BE2" />
                  </View>
                  <Text style={styles.metricTitle}>Sleep</Text>
                </View>
                <Text style={styles.metricValue}>{dashboard.sleepHours}<Text style={styles.metricUnit}> hrs</Text></Text>
                <Text style={styles.metricSubtitle}>Goal: {dashboard.sleepGoal} hrs</Text>
              </FloatingCard>
              
              {/* Exercise Card */}
              <FloatingCard style={[styles.metricCard, { width: '100%', marginTop: 12 }]}>
                <View style={styles.metricHeaderRow}>
                  <View style={[styles.metricIconWrap, { backgroundColor: '#FFF0F5' }]}>
                    <Activity size={20} color="#FF1493" />
                  </View>
                  <Text style={styles.metricTitle}>Face Exercises</Text>
                </View>
                <Text style={[styles.metricValue, { marginTop: 8 }]}>{dashboard.exerciseCompleted} <Text style={styles.metricUnit}>/ {dashboard.exerciseGoal} Completed</Text></Text>
                <TouchableOpacity style={styles.primaryActionBtn} onPress={() => dispatch(completeExercise())}>
                  <Text style={styles.primaryActionText}>Start Session</Text>
                </TouchableOpacity>
              </FloatingCard>

            </View>
          </Animated.View>

          {/* AI Insight */}
          <Animated.View style={[animatedEntrance, { marginTop: 24 }]}>
            <FloatingCard style={styles.insightCard}>
              <View style={styles.insightIconBox}>
                <Lightbulb size={24} color="#FF9500" />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightLabel}>Today&apos;s Insight</Text>
                <Text style={styles.insightText}>{dashboard.todayAIInsight}</Text>
              </View>
            </FloatingCard>
          </Animated.View>

          {/* Quick Scan */}
          <Animated.View style={[animatedEntrance, { marginTop: 24 }]}>
             <Text style={styles.sectionHeader}>Quick Actions</Text>
             <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/face-scan-guide')}>
                <FloatingCard style={styles.quickScanCard}>
                  <View style={styles.quickScanIconBox}>
                    <ScanFace size={28} color={BRAND_PRIMARY} />
                  </View>
                  <View>
                    <Text style={styles.quickScanTitle}>New Face Scan</Text>
                    <Text style={styles.quickScanSubtitle}>Get an updated analysis</Text>
                  </View>
                </FloatingCard>
             </TouchableOpacity>
          </Animated.View>

          {/* 30 Day Progress */}
          <Animated.View style={[animatedEntrance, { marginTop: 24 }]}>
            <FloatingCard style={styles.progressCard}>
              <View style={styles.progressHeaderRow}>
                <Text style={styles.progressTitle}>Transformation Progress</Text>
                <Text style={styles.progressDayLabel}>Day {dashboard.transformationDay}/30</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${(dashboard.transformationDay / 30) * 100}%` }]} />
              </View>
            </FloatingCard>
          </Animated.View>


        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_GRADIENT_START },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  
  orbTop: {
    position: 'absolute', top: -100, right: -100, width: 300, height: 300, 
    borderRadius: 150, backgroundColor: 'rgba(255, 230, 220, 0.4)',
  },
  orbBottom: {
    position: 'absolute', bottom: 100, left: -100, width: 250, height: 250, 
    borderRadius: 125, backgroundColor: 'rgba(255, 240, 245, 0.5)',
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
  },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 16, color: TEXT_SECONDARY, fontWeight: '500', marginBottom: 4 },
  userName: { fontSize: 32, color: TEXT_PRIMARY, fontWeight: '800', letterSpacing: -1, marginBottom: 16 },
  
  streakContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  streakBadge: { backgroundColor: '#FFF5E5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  streakBadgeText: { fontSize: 13, color: '#FF9500', fontWeight: '700' },
  streakSubtitle: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: '500' },
  
  notificationBtn: { 
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', 
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1C1C1E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12,
  },
  notificationDot: { position: 'absolute', top: 12, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30', borderWidth: 1, borderColor: '#FFF' },

  heroCard: { padding: 24 },
  heroCardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroTextContainer: { flex: 1, paddingRight: 16 },
  heroLabel: { fontSize: 16, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 8 },
  heroTrendText: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: '500', marginBottom: 16 },
  viewAnalysisBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F2F2F7', borderRadius: 8 },
  viewAnalysisText: { fontSize: 12, fontWeight: '600', color: TEXT_PRIMARY },
  
  heroRingContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  heroScoreInner: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  heroScoreValue: { fontSize: 32, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -1 },

  sectionHeader: { fontSize: 20, fontWeight: '800', color: TEXT_PRIMARY, letterSpacing: -0.5, marginBottom: 16 },

  checklistContainer: { gap: 10 },
  checklistItem: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, 
    borderRadius: 20, borderWidth: 1, borderColor: 'transparent'
  },
  checkboxOutline: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#C7C7CC', marginRight: 14, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#34C759', borderColor: '#34C759' },
  checklistText: { fontSize: 16, fontWeight: '600', color: TEXT_PRIMARY },
  checklistTextActive: { color: '#34C759', textDecorationLine: 'line-through' },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  metricCard: { width: (width - 60) / 2, padding: 20 },
  metricHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  metricIconWrap: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  metricTitle: { fontSize: 14, fontWeight: '600', color: TEXT_SECONDARY },
  metricValue: { fontSize: 24, fontWeight: '800', color: TEXT_PRIMARY },
  metricUnit: { fontSize: 14, fontWeight: '600', color: TEXT_SECONDARY },
  metricSubtitle: { fontSize: 13, color: TEXT_SECONDARY, marginTop: 4, fontWeight: '500' },
  
  metricActionRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  metricAddBtn: { flex: 1, backgroundColor: '#F2F2F7', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  metricAddText: { fontSize: 12, fontWeight: '700', color: '#007AFF' },
  
  primaryActionBtn: { backgroundColor: BRAND_PRIMARY, paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  primaryActionText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  insightCard: { flexDirection: 'row', padding: 20, alignItems: 'center', gap: 16 },
  insightIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF5E5', alignItems: 'center', justifyContent: 'center' },
  insightContent: { flex: 1 },
  insightLabel: { fontSize: 13, fontWeight: '700', color: '#FF9500', marginBottom: 4 },
  insightText: { fontSize: 14, color: TEXT_PRIMARY, fontWeight: '500', lineHeight: 20 },

  quickScanCard: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  quickScanIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F2EBE5', alignItems: 'center', justifyContent: 'center' },
  quickScanTitle: { fontSize: 16, fontWeight: '700', color: TEXT_PRIMARY, marginBottom: 2 },
  quickScanSubtitle: { fontSize: 13, color: TEXT_SECONDARY, fontWeight: '500' },

  progressCard: { padding: 24 },
  progressHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  progressTitle: { fontSize: 16, fontWeight: '700', color: TEXT_PRIMARY },
  progressDayLabel: { fontSize: 14, fontWeight: '600', color: BRAND_PRIMARY },
  progressBarTrack: { width: '100%', height: 10, backgroundColor: '#F2F2F7', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: BRAND_PRIMARY, borderRadius: 5 },
});
