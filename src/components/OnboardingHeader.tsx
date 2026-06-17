import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';

interface OnboardingHeaderProps {
  progressStyle: any;
}

export function OnboardingHeader({ progressStyle }: OnboardingHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="#1C1C1E" />
      </TouchableOpacity>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, progressStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF', // Solid white as seen in mockup
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#000', // Slight shadow to lift it off background
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  progressBarBackground: {
    flex: 1,
    height: 6, // Thicker bar
    backgroundColor: '#E8DDD6',
    borderRadius: 3,
    marginRight: 8, // Adjusted right edge
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2A2421',
    borderRadius: 3,
  },
});
