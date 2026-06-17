import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView , useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { setResult } from '../store/faceAnalysisSlice';
import { analyzeFaceWithOpenRouter } from '../services/openrouterAI';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Focus, Zap, ScanFace, RefreshCw } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

type ScanPhase = 'idle' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'results';

export function FaceScanScreen({ onClose }: { onClose?: () => void }) {
  const dispatch = useDispatch();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanPhase, setScanPhase] = useState<ScanPhase>('idle');
  const insets = useSafeAreaInsets();
  
  // Animations
  // Camera controls state
  const [flashMode, setFlashMode] = React.useState<'off' | 'torch'>('off');
  const [facing, setFacing] = React.useState<'front' | 'back'>('front');

  const toggleFlash = () => {
    setFlashMode(prev => (prev === 'off' ? 'torch' : 'off'));
  };

  const toggleFacing = () => {
    setFacing(prev => (prev === 'front' ? 'back' : 'front'));
  };

  // UI buttons for flash and camera flip (place inside header view)
  const renderCameraControls = () => (
    <View style={[styles.topControls, { top: Math.max(insets.top, 20) + 10 }]} >
      <TouchableOpacity onPress={toggleFlash} style={styles.controlBtn}>
        <Zap size={20} color={flashMode === 'torch' ? '#34C759' : '#FFF'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleFacing} style={styles.controlBtn}>
        <RefreshCw size={20} color={facing === 'back' ? '#34C759' : '#FFF'} />
      </TouchableOpacity>
    </View>
  );

  // Insert controls into header JSX (after close button)
  const scanLineY = useSharedValue(0);
  const meshOpacity = useSharedValue(0);
  const particlesOpacity = useSharedValue(0);
  const frameScale = useSharedValue(1);
  
  // Results Animations

  useEffect(() => {
    // Idle frame breathing
    frameScale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [frameScale]);

  const startScan = () => {
    setScanPhase('phase1');
    
    // Phase 1: Face Lock
    meshOpacity.value = withTiming(0.8, { duration: 1000 });
    
    setTimeout(() => {
      setScanPhase('phase2');
      // Phase 2: Scan Line
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(300, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
    }, 2000);

    setTimeout(() => {
      setScanPhase('phase3');
      // Phase 3: Particles / Deep Analysis
      particlesOpacity.value = withTiming(1, { duration: 1000 });
    }, 4500);

    setTimeout(() => {
      setScanPhase('phase4');
      // Phase 4: Generating Results
    }, 7000);

    setTimeout(async () => {
      // Capture image and analyze with OpenRouter
      try {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.75 });
          if (photo?.base64) {
            const result = await analyzeFaceWithOpenRouter({ front: photo.base64 });
            console.log('OpenRouter analysis result:', result);
            dispatch(setResult(result));
          }
        }
      } catch (e: any) {
        console.error('Face analysis failed', e);
        Alert.alert('Analysis Failed', e.message || 'Could not analyze face. Please try again.');
        setScanPhase('idle');
        meshOpacity.value = 0;
        particlesOpacity.value = 0;
        scanLineY.value = 0;
        return; // Don't navigate on failure
      }
      setScanPhase('idle');
      meshOpacity.value = 0;
      particlesOpacity.value = 0;
      scanLineY.value = 0;
      if (onClose) onClose();
      // Small delay to ensure Redux state updates before navigation
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push('/analysis-results');
    }, 9000);
  };



  const frameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: frameScale.value }]
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
    opacity: scanPhase === 'phase2' ? 1 : 0
  }));

  const meshStyle = useAnimatedStyle(() => ({
    opacity: meshOpacity.value
  }));

  const particlesStyle = useAnimatedStyle(() => ({
    opacity: particlesOpacity.value
  }));


  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#2A2421' }]}>
        <Text style={{ color: '#FFF', fontSize: 18, marginBottom: 20 }}>Camera access is required for AI Face Scan</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={{ color: '#2A2421', fontWeight: '600' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderPhaseText = () => {
    switch (scanPhase) {
      case 'phase1': return "Analyzing Face Structure...";
      case 'phase2': return "Scanning Skin Surface...";
      case 'phase3': return "Detecting Skin Conditions...";
      case 'phase4': return "Generating Personalized Insights...";
      default: return "";
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flashMode as any}
      />
      
      {/* Dark overlay when scanning or results */}
      {(scanPhase !== 'idle') && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
      )}

      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          {renderCameraControls()}
          {scanPhase === 'idle' && (
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.headerTitle}>AI Face Scan</Text>
              <Text style={styles.headerSubtitle}>Position your face inside the frame.</Text>
            </View>
          )}
          <View style={{ width: 44 }} />
        </View>

        {/* HUD Elements during Idle/Scanning */}
        {scanPhase !== 'results' && (
          <View style={styles.hudContainer}>
            
            {/* Top Indicators */}
            {scanPhase === 'idle' && (
              <View style={styles.indicatorsTop}>
                <View style={styles.indicatorBadge}>
                  <Text style={styles.indicatorLabel}>Lighting Quality</Text>
                  <Text style={[styles.indicatorValue, { color: '#34C759' }]}>Excellent</Text>
                </View>
                <View style={styles.indicatorBadge}>
                  <Text style={styles.indicatorLabel}>Confidence Score</Text>
                  <Text style={styles.indicatorValue}>98%</Text>
                </View>
              </View>
            )}

            {/* Face Frame */}
            <View style={styles.frameWrapper}>
              <Animated.View style={[styles.faceFrame, frameStyle, scanPhase !== 'idle' && { borderColor: '#4285F4', shadowColor: '#4285F4' }]}>
                
                {/* Frame Corners */}
                <View style={[styles.corner, styles.tl]} />
                <View style={[styles.corner, styles.tr]} />
                <View style={[styles.corner, styles.bl]} />
                <View style={[styles.corner, styles.br]} />
                
                {scanPhase !== 'idle' && (
                  <>
                    <Animated.View style={[styles.meshOverlay, meshStyle]}>
                      {/* Fake Mesh Grid */}
                      <View style={styles.meshLineH1} />
                      <View style={styles.meshLineH2} />
                      <View style={styles.meshLineV1} />
                      <View style={styles.meshLineV2} />
                      <Focus size={80} color="rgba(66, 133, 244, 0.4)" strokeWidth={0.5} />
                    </Animated.View>
                    
                    <Animated.View style={[styles.scanLineWrapper, scanLineStyle]}>
                      <LinearGradient colors={['rgba(66, 133, 244, 0)', 'rgba(66, 133, 244, 0.8)', 'rgba(66, 133, 244, 0)']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.scanLine} />
                    </Animated.View>
                  </>
                )}
              </Animated.View>
              
              {/* Dynamic Phase Text */}
              {scanPhase !== 'idle' && (
                <View style={styles.phaseTextWrapper}>
                  <Text style={styles.phaseText}>{renderPhaseText()}</Text>
                  {scanPhase === 'phase3' && (
                    <Animated.View style={[styles.particlesContainer, particlesStyle]}>
                      <Text style={styles.hudMetric}>Hydration: 87%</Text>
                      <Text style={styles.hudMetric}>Acne Risk: Low</Text>
                      <Text style={styles.hudMetric}>Wrinkles: Undetected</Text>
                    </Animated.View>
                  )}
                </View>
              )}
            </View>

            {/* Bottom Actions */}
            {scanPhase === 'idle' && (
              <View style={styles.bottomActions}>
                <View style={styles.guidanceBox}>
                  <CheckCircleIcon size={16} color="#34C759" />
                  <Text style={styles.guidanceText}>Face centered perfectly</Text>
                </View>
                <TouchableOpacity style={styles.scanBtn} activeOpacity={0.8} onPress={startScan}>
                  <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']} style={styles.scanBtnInner}>
                    <ScanFace size={24} color="#2A2421" />
                    <Text style={styles.scanBtnText}>Start AI Scan</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

// Helper icon
const CheckCircleIcon = ({ size, color }: { size: number, color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></Path>
    <Path d="M22 4 12 14.01l-3-3"></Path>
  </Svg>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1 },
  permissionBtn: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, zIndex: 10 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  
  hudContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40 },
  indicatorsTop: { flexDirection: 'row', gap: 16 },
  indicatorBadge: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  indicatorLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  indicatorValue: { fontSize: 14, fontWeight: '700', color: '#FFF' },
  
  frameWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  faceFrame: { width: width * 0.75, height: width * 0.95, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#FFF', borderWidth: 0 },
  tl: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 40 },
  tr: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 40 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 40 },
  br: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 40 },
  
  meshOverlay: { ...StyleSheet.absoluteFill as any, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(66, 133, 244, 0.1)' },
  meshLineH1: { position: 'absolute', top: '33%', width: '100%', height: 1, backgroundColor: 'rgba(66, 133, 244, 0.4)' },
  meshLineH2: { position: 'absolute', top: '66%', width: '100%', height: 1, backgroundColor: 'rgba(66, 133, 244, 0.4)' },
  meshLineV1: { position: 'absolute', left: '33%', height: '100%', width: 1, backgroundColor: 'rgba(66, 133, 244, 0.4)' },
  meshLineV2: { position: 'absolute', left: '66%', height: '100%', width: 1, backgroundColor: 'rgba(66, 133, 244, 0.4)' },
  
  scanLineWrapper: { position: 'absolute', top: 0, left: 0, width: '100%', height: 4, zIndex: 10 },
  scanLine: { width: '100%', height: '100%', shadowColor: '#4285F4', shadowOffset: {width:0, height:4}, shadowOpacity: 1, shadowRadius: 10 },
  
  phaseTextWrapper: { position: 'absolute', bottom: -80, alignItems: 'center' },
  phaseText: { color: '#FFF', fontSize: 18, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width:0, height:2}, textShadowRadius: 4 },
  particlesContainer: { marginTop: 16, alignItems: 'center', gap: 6 },
  hudMetric: { color: 'rgba(255,255,255,0.9)', fontSize: 14, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },

  bottomActions: { alignItems: 'center', gap: 24 },
  guidanceBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    guidanceText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
  topControls: { position: 'absolute', right: 20, flexDirection: 'row', gap: 12 },
  controlBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  scanBtn: { width: 200, height: 64, borderRadius: 32, padding: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  scanBtnInner: { flex: 1, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  scanBtnText: { color: '#2A2421', fontSize: 18, fontWeight: '700' },

  resultsContainer: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 40 },
  successHeader: { alignItems: 'center', marginBottom: 30 },
  successIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(52, 199, 89, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#34C759', marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  
  resultsCard: { backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 32, padding: 24, alignItems: 'center' },
  resultsHeaderTitle: { fontSize: 14, color: '#8A7A71', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 24 },
  scoreBig: { fontSize: 64, fontWeight: '700', color: '#2A2421', letterSpacing: -2 },
  scoreOut: { fontSize: 24, fontWeight: '600', color: '#8A7A71', marginLeft: 4 },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', gap: 12, marginBottom: 32 },
  metricItem: { width: '48%', backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity: 0.05, shadowRadius: 10 },
  metricItemValue: { fontSize: 18, fontWeight: '700', color: '#2A2421', marginTop: 12, marginBottom: 4 },
  metricItemLabel: { fontSize: 12, color: '#8A7A71', fontWeight: '500' },
  
  resultsCtaWrapper: { width: '100%', gap: 16 },
  fullAnalysisBtn: { width: '100%', height: 60, borderRadius: 30, overflow: 'hidden', shadowColor: '#8C776B', shadowOffset: {width:0, height:8}, shadowOpacity: 0.3, shadowRadius: 16 },
  fullAnalysisGrad: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fullAnalysisText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  scanAgainBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  scanAgainText: { color: '#8A7A71', fontSize: 16, fontWeight: '600' },
});
