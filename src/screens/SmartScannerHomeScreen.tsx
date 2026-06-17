import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Utensils, Coffee, Package, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const BRAND_BROWN = '#2A2421';
const MUTED_BROWN = '#8A7A71';

const ScannerOptionCard = ({ title, description, icon: Icon, color, routeType, delay }: any) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600, easing: Easing.out(Easing.exp) }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600, easing: Easing.out(Easing.exp) }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.optionCard}
        onPress={() => router.push({ pathname: '/smart-camera', params: { type: routeType } })}
      >
        <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']} style={StyleSheet.absoluteFill} />
        
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={32} color={color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{description}</Text>
        </View>
        <ChevronRightIcon />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ChevronRightIcon = () => (
  <View style={styles.chevronBox}>
    <ChevronLeft size={20} color={MUTED_BROWN} style={{ transform: [{ rotate: '180deg' }] }} />
  </View>
);

export function SmartScannerHomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient colors={[IVORY_WHITE, CHAMPAGNE_BEIGE]} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        
        {/* Top Nav */}
        <View style={[styles.topNav, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#2A2421" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Smart Scanner</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.heroBadge}>
              <Sparkles size={14} color="#FFF" />
              <Text style={styles.heroBadgeText}>AI Powered Analysis</Text>
            </View>
            <Text style={styles.headerTitle}>What would you like to scan today?</Text>
            <Text style={styles.headerSubtitle}>
              Our AI instantly analyzes foods, drinks, and grooming products to tell you how they impact your skin.
            </Text>
          </Animated.View>

          <View style={styles.optionsList}>
            <ScannerOptionCard 
              title="Food Scanner"
              description="Analyze calories, macros, and get an AI verdict on skin impact."
              icon={Utensils}
              color="#e67e22"
              routeType="food"
              delay={100}
            />
            
            <ScannerOptionCard 
              title="Drink Scanner"
              description="Detect sugar levels, hydration score, and skin health effects."
              icon={Coffee}
              color="#3498db"
              routeType="drink"
              delay={200}
            />
            
            <ScannerOptionCard 
              title="Product Scanner"
              description="Read ingredients, flag harmful chemicals, and check compatibility."
              icon={Package}
              color="#9b59b6"
              routeType="product"
              delay={300}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  safeArea: { flex: 1 },
  
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 18, fontWeight: '600', color: BRAND_BROWN },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 },
  
  header: { marginBottom: 40 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: BRAND_BROWN, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 16 },
  heroBadgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  headerTitle: { fontSize: 32, fontWeight: '700', color: BRAND_BROWN, marginBottom: 12, letterSpacing: -0.5, lineHeight: 40 },
  headerSubtitle: { fontSize: 16, color: MUTED_BROWN, lineHeight: 24 },

  optionsList: { gap: 16 },
  
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 16,
  },
  iconContainer: {
    width: 64, height: 64,
    borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: { flex: 1, marginRight: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: BRAND_BROWN, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#6A5F58', lineHeight: 18 },
  chevronBox: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center', justifyContent: 'center',
  }
});
