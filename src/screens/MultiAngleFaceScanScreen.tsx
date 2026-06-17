"use no memo";
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, RotateCcw, Check, ChevronRight } from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { setPendingImage, clearPendingImages } from '../store/faceAnalysisSlice';

const { width } = Dimensions.get('window');

type AngleState = 'front' | 'left' | 'right';
const ANGLE_ORDER: AngleState[] = ['front', 'left', 'right'];

const ANGLE_CONFIG = {
  front: {
    title: 'Front Scan',
    instruction: 'Look straight ahead',
    detail: 'Keep your face completely neutral',
    facing: 'front' as const,
  },
  left: {
    title: 'Left Scan',
    instruction: 'Turn head slowly left',
    detail: 'Show your full left profile',
    facing: 'front' as const,
  },
  right: {
    title: 'Right Scan',
    instruction: 'Turn head slowly right',
    detail: 'Show your full right profile',
    facing: 'front' as const,
  },
};

export function MultiAngleFaceScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [currentAngle, setCurrentAngle] = useState<AngleState>('front');
  const [capturedAngles, setCapturedAngles] = useState<Set<AngleState>>(new Set());
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearPendingImages());
  }, [dispatch]);

  const flashOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const triggerFlash = () => {
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 40, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) })
    );
  };

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }]
  }));

  const handleCapture = async () => {
    if (isCapturing || !cameraRef.current) return;
    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.75,
      });

      if (!photo?.base64) throw new Error('Failed to capture photo');

      triggerFlash();

      dispatch(setPendingImage({ angle: currentAngle, base64: photo.base64 }));

      const newCaptured = new Set(capturedAngles);
      newCaptured.add(currentAngle);
      setCapturedAngles(newCaptured);

      await new Promise(resolve => setTimeout(resolve, 400));

      const currentIndex = ANGLE_ORDER.indexOf(currentAngle);
      if (currentIndex < ANGLE_ORDER.length - 1) {
        setCurrentAngle(ANGLE_ORDER[currentIndex + 1]);
      } else {
        router.push('/ai-analysis');
      }
    } catch (err: any) {
      Alert.alert('Capture Failed', err.message || 'Could not capture photo.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    dispatch(clearPendingImages());
    setCapturedAngles(new Set());
    setCurrentAngle('front');
  };

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const config = ANGLE_CONFIG[currentAngle];
  const currentIndex = ANGLE_ORDER.indexOf(currentAngle);

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={config.facing}
      />

      <View style={[StyleSheet.absoluteFill, styles.overlayDark]} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 10) }]}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.back()}>
            <X size={22} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.stepPill}>
            <Text style={styles.stepPillText}>Step {currentIndex + 1} of 3</Text>
          </View>

          <TouchableOpacity style={styles.navBtn} onPress={handleReset} disabled={capturedAngles.size === 0}>
            <RotateCcw size={20} color={capturedAngles.size > 0 ? '#FFF' : 'rgba(255,255,255,0.3)'} />
          </TouchableOpacity>
        </View>

        {/* Dynamic Instruction Float */}
        <View style={styles.instructionWrapper}>
          <Animated.View key={currentAngle} entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)} style={styles.instructionPill}>
            <Text style={styles.instructionTitle}>{config.instruction}</Text>
            <Text style={styles.instructionDetail}>{config.detail}</Text>
          </Animated.View>
        </View>

        {/* Reticle / Face Frame */}
        <View style={styles.frameWrapper}>
          <Animated.View style={[styles.reticle, pulseStyle]}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            
            {/* Center Focus Dot */}
            <View style={styles.centerDot} />
          </Animated.View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <View style={styles.guidanceRow}>
             <Text style={styles.guidanceText}>Ensure even lighting & remove glasses</Text>
          </View>

          {/* Professional Shutter Button */}
          <TouchableOpacity
            style={[styles.shutterBtnOuter, isCapturing && styles.shutterBtnDisabled]}
            activeOpacity={0.7}
            onPress={handleCapture}
            disabled={isCapturing}
          >
            <View style={styles.shutterBtnInner}>
               {isCapturing && <View style={styles.shutterBtnCapturing} />}
            </View>
          </TouchableOpacity>
          <Text style={styles.captureLabel}>{config.title}</Text>
        </View>
      </SafeAreaView>

      <Animated.View style={[StyleSheet.absoluteFill, styles.flashOverlay, flashStyle]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  overlayDark: { backgroundColor: 'rgba(0,0,0,0.45)' },

  permissionTitle: { color: '#FFF', fontSize: 20, fontWeight: '700', marginBottom: 20 },
  permissionBtn: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  permissionBtnText: { color: '#000', fontWeight: '700' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, zIndex: 10 },
  navBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' },
  stepPill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  stepPillText: { color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

  instructionWrapper: { alignItems: 'center', marginTop: 24 },
  instructionPill: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  instructionTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  instructionDetail: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },

  frameWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: width * 0.75, height: width * 1.05, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#FFF', borderWidth: 0, shadowColor: '#FFF', shadowOffset: {width:0, height:0}, shadowOpacity: 0.4, shadowRadius: 10 },
  tl: { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 40 },
  tr: { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 40 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 40 },
  br: { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 40 },
  centerDot: { position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)', transform: [{translateX:-2}, {translateY:-2}] },

  bottomActions: { alignItems: 'center', paddingBottom: 40 },
  guidanceRow: { marginBottom: 24 },
  guidanceText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 1 },

  shutterBtnOuter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#FFF', padding: 3, alignItems: 'center', justifyContent: 'center' },
  shutterBtnInner: { width: '100%', height: '100%', borderRadius: 34, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  shutterBtnDisabled: { opacity: 0.6 },
  shutterBtnCapturing: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.1)' },
  
  captureLabel: { color: '#FFF', fontSize: 14, fontWeight: '600', marginTop: 16 },
  flashOverlay: { backgroundColor: '#FFF', zIndex: 200 },
});
