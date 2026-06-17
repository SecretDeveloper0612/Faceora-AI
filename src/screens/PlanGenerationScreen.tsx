import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { BrainCircuit } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setPlan, setLoading, setError } from '@/store/planSlice';
import { PersonalTransformationEngine } from '@/services/PersonalTransformationEngine';
import { SupabaseService } from '@/services/SupabaseService';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#DCC7BC';
const PREMIUM_DARK = '#2A2421';

export function PlanGenerationScreen() {
  const dispatch = useDispatch();
  const onboardingState = useSelector((state: RootState) => state.onboarding);
  const userState = useSelector((state: RootState) => state.user);
  const faceAnalysis = useSelector((state: RootState) => state.faceAnalysis.result);

  const pulseScale = useSharedValue(1);
  const ringRotation = useSharedValue(0);

  useEffect(() => {
    // Animations
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    ringRotation.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false
    );

    // Plan generation (defined inline to avoid stale closure / re-render warnings)
    const runGenerate = async () => {
      dispatch(setLoading(true));
      try {
        const heightInMeters = onboardingState.height / 100;
        const bmi = heightInMeters > 0 ? onboardingState.weight / (heightInMeters * heightInMeters) : 22;

        const previousPlan = userState.id ? await SupabaseService.getLatestPlan(userState.id) : null;

        const plan = await PersonalTransformationEngine.generatePlan(
          onboardingState,
          parseFloat(bmi.toFixed(1)),
          faceAnalysis,
          previousPlan
        );

        dispatch(setPlan(plan));

        if (userState.id) {
          await SupabaseService.saveProfile(userState.id, onboardingState, bmi);
          await SupabaseService.saveAIPlan(userState.id, plan);
        }

        dispatch(setLoading(false));
        setTimeout(() => router.replace('/(tabs)'), 1500);
      } catch (error: any) {
        console.error(error);
        dispatch(setError(error.message || 'Failed to generate plan'));
        dispatch(setLoading(false));
      }
    };

    runGenerate();
  }, [dispatch, faceAnalysis, onboardingState, pulseScale, ringRotation, userState.id]);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }]
  }));

  const animatedRing = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotation.value}deg` }]
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE, WARM_NUDE]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, animatedPulse]}>
            <Animated.View style={[styles.ring, animatedRing]} />
            <LinearGradient
              colors={['rgba(140, 119, 107, 0.2)', 'rgba(42, 36, 33, 0.1)']}
              style={styles.innerCircle}
            >
              <BrainCircuit size={48} color={PREMIUM_DARK} />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.title}>Creating Your Plan</Text>
          <Text style={styles.subtitle}>
            Faceora AI is analyzing your scans and lifestyle data to build a custom 30-day transformation...
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IVORY_WHITE,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(140, 119, 107, 0.3)',
    borderStyle: 'dashed',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: PREMIUM_DARK,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6A5F58',
    textAlign: 'center',
    lineHeight: 24,
  }
});
