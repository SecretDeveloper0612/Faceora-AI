"use no memo";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn, FadeOut,
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withDelay,
  Easing, interpolate,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setResult, setAnalyzing, setAnalysisError, clearPendingImages } from '../store/faceAnalysisSlice';
import { analyzeFaceWithOpenRouter } from '../services/openrouterAI';
import { Brain, ScanFace, Droplets, Activity, Sparkles, RotateCcw } from 'lucide-react-native';


const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const BRAND_BROWN = '#2A2421';
const MUTED_BROWN = '#8A7A71';
const ACCENT = '#8C776B';

const updateSharedValue = (sv: any, val: any) => {
  sv.value = val;
};

interface AnalysisStep {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  duration: number; // ms
  progressEnd: number; // 0-100
}

const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    label: 'Detecting Face...',
    sublabel: 'Locating facial landmarks',
    icon: <ScanFace size={22} color={ACCENT} />,
    duration: 2500,
    progressEnd: 15,
  },
  {
    label: 'Analyzing Skin Health...',
    sublabel: 'Evaluating texture, clarity & tone',
    icon: <Activity size={22} color={ACCENT} />,
    duration: 3000,
    progressEnd: 35,
  },
  {
    label: 'Analyzing Symmetry...',
    sublabel: 'Measuring facial structure & balance',
    icon: <ScanFace size={22} color={ACCENT} />,
    duration: 2500,
    progressEnd: 55,
  },
  {
    label: 'Evaluating Hydration...',
    sublabel: 'Detecting moisture & skin elasticity',
    icon: <Droplets size={22} color={ACCENT} />,
    duration: 2500,
    progressEnd: 70,
  },
  {
    label: 'Calculating Face Score...',
    sublabel: 'Computing your Faceora score',
    icon: <Brain size={22} color={ACCENT} />,
    duration: 2000,
    progressEnd: 85,
  },
  {
    label: 'Generating Report...',
    sublabel: 'Building your personalized analysis',
    icon: <Sparkles size={22} color={ACCENT} />,
    duration: 2000,
    progressEnd: 99,
  },
];

export function AIAnalysisScreen() {
  const dispatch = useDispatch();
  const pendingImages = useSelector((s: RootState) => s.faceAnalysis.pendingImages);

  const [stepIndex, setStepIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const analysisStarted = useRef(false);

  // Animations
  const pulse = useSharedValue(0);
  const outerRing = useSharedValue(0);
  const progressValue = useSharedValue(0);
  const particleOpacity = useSharedValue(0);

  useEffect(() => {
    // Core pulse
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1, true
    );
    outerRing.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1, true
    );
    particleOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
  }, [pulse, outerRing, particleOpacity]);

  const runAnalysis = useCallback(async () => {
    // Animate through display steps (UI only)
    let elapsed = 0;
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      const step = ANALYSIS_STEPS[i];
      setTimeout(() => {
        setStepIndex(i);
        updateSharedValue(progressValue, withTiming(step.progressEnd, {
          duration: step.duration - 100,
          easing: Easing.out(Easing.exp),
        }));
      }, elapsed);
      elapsed += step.duration;
    }

    // Run actual AI analysis in parallel
    try {
      const front = pendingImages.front;
      const left = pendingImages.left ?? undefined;
      const right = pendingImages.right ?? undefined;

      if (!front) {
        throw new Error('No face image captured. Please go back and take a photo.');
      }

      const result = await analyzeFaceWithOpenRouter({ front, left, right });

      // Complete the progress bar
      updateSharedValue(progressValue, withTiming(100, { duration: 500 }));

      // Wait for UI animations to finish (at least 2s remaining)
      const minWait = Math.max(0, elapsed - Date.now() + 1500);
      await new Promise(resolve => setTimeout(resolve, minWait));

      dispatch(setResult(result));
      dispatch(clearPendingImages());

      router.replace('/analysis-results');
    } catch (err: any) {
      console.error('[AIAnalysis] Error:', err);
      const msg = err?.message || 'AI analysis failed. Please try again.';
      dispatch(setAnalysisError(msg));
      setErrorMsg(msg);
      setFailed(true);
    }
  }, [dispatch, pendingImages, progressValue]);

  useEffect(() => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;

    dispatch(setAnalyzing(true));
    runAnalysis();
  }, [dispatch, runAnalysis]);



  const handleRetry = () => {
    setFailed(false);
    setErrorMsg('');
    setStepIndex(0);
    updateSharedValue(progressValue, 0);
    analysisStarted.current = false;
    dispatch(setAnalyzing(true));
    setTimeout(() => {
      analysisStarted.current = true;
      runAnalysis();
    }, 300);
  };

  // Animated styles
  const coreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.92, 1.08]) }],
    shadowOpacity: interpolate(pulse.value, [0, 1], [0.15, 0.45]),
  }));

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(outerRing.value, [0, 1], [1.0, 1.6]) }],
    opacity: interpolate(outerRing.value, [0, 0.7, 1], [0.4, 0.1, 0]),
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(outerRing.value, [0, 1], [1.0, 2.2]) }],
    opacity: interpolate(outerRing.value, [0, 0.5, 1], [0.2, 0.05, 0]),
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const particleStyle = useAnimatedStyle(() => ({
    opacity: particleOpacity.value,
  }));

  const currentStep = ANALYSIS_STEPS[stepIndex];

  // ── Error / Retry State ──
  if (failed) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[IVORY_WHITE, CHAMPAGNE_BEIGE]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <View style={styles.errorIconWrap}>
              <RotateCcw size={40} color={ACCENT} />
            </View>
            <Text style={styles.errorTitle}>Analysis Failed</Text>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
              <LinearGradient colors={['#8C776B', '#635147']} style={styles.retryBtnGrad}>
                <RotateCcw size={18} color="#FFF" />
                <Text style={styles.retryBtnText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
              <Text style={styles.backLinkText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, '#DCC7BC']} style={StyleSheet.absoluteFill} />

      {/* Floating particles */}
      <Animated.View style={[StyleSheet.absoluteFill, particleStyle]} pointerEvents="none">
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                top: `${(Math.sin(i * 321) * 0.5 + 0.5) * 95}%` as any,
                left: `${(Math.cos(i * 123) * 0.5 + 0.5) * 95}%` as any,
                width: (Math.sin(i * 213) * 0.5 + 0.5) * 5 + 2,
                height: (Math.sin(i * 213) * 0.5 + 0.5) * 5 + 2,
                opacity: (Math.sin(i * 312) * 0.5 + 0.5) * 0.35 + 0.05,
              }
            ]}
          />
        ))}
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* AI Logo / Pulse animation */}
          <View style={styles.animContainer}>
            {/* Outer expanding rings */}
            <Animated.View style={[styles.pulsRing, ring2Style]} />
            <Animated.View style={[styles.pulsRing, ring1Style]} />

            {/* Core circle */}
            <Animated.View style={[styles.core, coreStyle]}>
              <LinearGradient
                colors={['#A89080', '#635147']}
                style={styles.coreGradient}
              >
                <Brain size={40} color="#FFF" strokeWidth={1.5} />
              </LinearGradient>
            </Animated.View>
          </View>

          {/* Step Text */}
          <View style={styles.stepTextWrap}>
            <Animated.View
              key={stepIndex}
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(200)}
              style={styles.stepTextInner}
            >
              <View style={styles.stepIconRow}>
                {currentStep.icon}
                <Text style={styles.stepLabel}>{currentStep.label}</Text>
              </View>
              <Text style={styles.stepSublabel}>{currentStep.sublabel}</Text>
            </Animated.View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, progressStyle]}>
                <LinearGradient
                  colors={['#A89080', '#635147']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressHint}>
              Step {stepIndex + 1} of {ANALYSIS_STEPS.length}
            </Text>
          </View>

          {/* Step checklist */}
          <View style={styles.checklist}>
            {ANALYSIS_STEPS.map((step, i) => (
              <View key={i} style={styles.checklistItem}>
                <View style={[
                  styles.checkDot,
                  i < stepIndex && styles.checkDotDone,
                  i === stepIndex && styles.checkDotActive,
                ]} />
                <Text style={[
                  styles.checkLabel,
                  i < stepIndex && styles.checkLabelDone,
                  i === stepIndex && styles.checkLabelActive,
                ]}>
                  {step.label.replace('...', '')}
                </Text>
              </View>
            ))}
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  safeArea: { flex: 1 },
  content: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 32,
  },

  particle: {
    position: 'absolute', backgroundColor: '#8C776B',
    borderRadius: 10,
  },

  // Pulse animation
  animContainer: {
    width: 180, height: 180,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 40,
  },
  pulsRing: {
    position: 'absolute', width: 100, height: 100,
    borderRadius: 50, borderWidth: 1.5,
    borderColor: ACCENT,
  },
  core: {
    width: 100, height: 100, borderRadius: 50,
    shadowColor: ACCENT, shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
  },
  coreGradient: {
    flex: 1, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
  },

  // Step text
  stepTextWrap: { height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 32, width: '100%' },
  stepTextInner: { alignItems: 'center' },
  stepIconRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 8,
  },
  stepLabel: { fontSize: 20, fontWeight: '700', color: BRAND_BROWN },
  stepSublabel: { fontSize: 14, color: MUTED_BROWN, textAlign: 'center' },

  // Progress
  progressSection: { width: '100%', alignItems: 'center', marginBottom: 32 },
  progressTrack: {
    width: '100%', height: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 4, overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: { height: '100%', borderRadius: 4 },
  progressHint: { fontSize: 13, color: MUTED_BROWN, fontWeight: '500' },

  // Checklist
  checklist: {
    width: '100%', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  checklistItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  checkDotDone: { backgroundColor: '#34C759' },
  checkDotActive: { backgroundColor: ACCENT },
  checkLabel: { fontSize: 13, color: 'rgba(0,0,0,0.3)', fontWeight: '500' },
  checkLabelDone: { color: '#34C759', textDecorationLine: 'line-through' },
  checkLabelActive: { color: BRAND_BROWN, fontWeight: '700' },

  // Error state
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  errorIconWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(140, 119, 107, 0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: { fontSize: 24, fontWeight: '700', color: BRAND_BROWN, marginBottom: 12 },
  errorMsg: {
    fontSize: 15, color: MUTED_BROWN, textAlign: 'center',
    lineHeight: 22, marginBottom: 32,
  },
  retryBtn: { borderRadius: 28, overflow: 'hidden', marginBottom: 16 },
  retryBtnGrad: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 32, paddingVertical: 16,
  },
  retryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  backLink: { paddingVertical: 12 },
  backLinkText: { color: MUTED_BROWN, fontSize: 15, fontWeight: '600' },
});
