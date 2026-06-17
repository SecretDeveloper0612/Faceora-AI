import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Camera, ScanLine } from 'lucide-react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export function SmartCameraScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  
  const flashOpacity = useSharedValue(0);

  const triggerFlash = () => {
    flashOpacity.value = withSequence(
      withTiming(1, { duration: 50, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) })
    );
  };

  const handleCapture = () => {
    triggerFlash();
    setTimeout(() => {
      // Pass the scanned type to the results screen
      router.push({ pathname: '/scanner-results', params: { type } });
    }, 400);
  };

  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOpacity.value }));

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#2A2421' }]}>
        <Text style={{ color: '#FFF', fontSize: 18, marginBottom: 20 }}>Camera access is required.</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={{ color: '#2A2421', fontWeight: '600' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getTitle = () => {
    switch (type) {
      case 'food': return 'Scan Food';
      case 'drink': return 'Scan Drink';
      case 'product': return 'Scan Product Ingredients';
      default: return 'Smart Scan';
    }
  };

  const getOverlayText = () => {
    switch (type) {
      case 'food': return 'Center the plate in the frame';
      case 'drink': return 'Center the drink or label in the frame';
      case 'product': return 'Position the ingredient list clearly';
      default: return 'Position object in frame';
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
      
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} pointerEvents="none" />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* HUD Elements */}
        <View style={styles.hudContainer}>
          
          <Animated.View entering={FadeIn.duration(400)} style={styles.instructionPill}>
            <Text style={styles.instructionText}>{getOverlayText()}</Text>
          </Animated.View>

          {/* Dynamic Frame */}
          <View style={styles.frameWrapper}>
            <View style={[styles.scanFrame, type === 'product' && styles.productFrame]}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              <ScanLine size={40} color="rgba(255,255,255,0.4)" strokeWidth={1} style={{ position: 'absolute' }} />
            </View>
          </View>

          {/* Capture Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.captureOuterBtn} activeOpacity={0.8} onPress={handleCapture}>
              <View style={styles.captureInnerBtn}>
                <Camera size={28} color="#2A2421" />
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </SafeAreaView>

      <Animated.View style={[StyleSheet.absoluteFill, styles.flashOverlay, flashStyle]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  permissionBtn: { backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, zIndex: 10 },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  
  hudContainer: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40 },
  
  instructionPill: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  instructionText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  frameWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  scanFrame: { width: width * 0.75, height: width * 0.75, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productFrame: { height: height * 0.5, borderRadius: 20 }, // Taller frame for reading ingredient lists
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#FFF', borderWidth: 0 },
  tl: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 40 },
  tr: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 40 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 40 },
  br: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 40 },
  
  bottomActions: { alignItems: 'center', paddingBottom: 20 },
  captureOuterBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  captureInnerBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  
  flashOverlay: { backgroundColor: '#FFF', zIndex: 100 },
});
