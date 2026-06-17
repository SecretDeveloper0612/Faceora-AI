import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Utensils, Coffee, Package, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Activity } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const BRAND_BROWN = '#2A2421';
const MUTED_BROWN = '#8A7A71';

const GlassCard = ({ children, style, delay = 0 }: any) => {
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
    <Animated.View style={[styles.glassCard, style, animatedStyle]}>
      <View style={styles.glassCardBackground} />
      {children}
    </Animated.View>
  );
};

export function ScannerResultsScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const insets = useSafeAreaInsets();
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 2500); // Fake AI analysis time
    return () => clearTimeout(timer);
  }, []);

  const renderFoodAnalysis = () => (
    <>
      <GlassCard delay={100} style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Utensils size={24} color="#e67e22" />
          <Text style={styles.cardTitle}>Food Analysis</Text>
        </View>
        <Text style={styles.detectedItemText}>Detected: Pepperoni Pizza Slice</Text>
        
        <View style={styles.macrosGrid}>
          <View style={styles.macroBox}><Text style={styles.macroVal}>280</Text><Text style={styles.macroLbl}>Calories</Text></View>
          <View style={styles.macroBox}><Text style={styles.macroVal}>12g</Text><Text style={styles.macroLbl}>Protein</Text></View>
          <View style={styles.macroBox}><Text style={styles.macroVal}>32g</Text><Text style={styles.macroLbl}>Carbs</Text></View>
          <View style={styles.macroBox}><Text style={styles.macroVal}>11g</Text><Text style={styles.macroLbl}>Fat</Text></View>
        </View>
      </GlassCard>

      <GlassCard delay={200} style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Sparkles size={24} color="#3498db" />
          <Text style={styles.cardTitle}>Skin Impact</Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Good For Your Skin</Text>
          <Text style={[styles.scoreValue, { color: '#e74c3c' }]}>32%</Text>
        </View>
        <View style={styles.verdictBox}>
          <AlertTriangle size={20} color="#e74c3c" />
          <Text style={styles.verdictText}>May increase acne due to high oil and dairy content.</Text>
        </View>
      </GlassCard>
    </>
  );

  const renderDrinkAnalysis = () => (
    <>
      <GlassCard delay={100} style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Coffee size={24} color="#3498db" />
          <Text style={styles.cardTitle}>Drink Analysis</Text>
        </View>
        <Text style={styles.detectedItemText}>Detected: Iced Caramel Latte</Text>
        
        <View style={styles.statsList}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Category</Text>
            <Text style={styles.statValue}>Coffee</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Sugar Level</Text>
            <Text style={[styles.statValue, { color: '#e74c3c' }]}>High (38g)</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Hydration Score</Text>
            <Text style={[styles.statValue, { color: '#f39c12' }]}>Low</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard delay={200} style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Activity size={24} color="#e74c3c" />
          <Text style={styles.cardTitle}>AI Verdict</Text>
        </View>
        <View style={styles.verdictBox}>
          <AlertTriangle size={20} color="#e74c3c" />
          <Text style={styles.verdictText}>High sugar may cause breakouts and caffeine may contribute to dehydration.</Text>
        </View>
      </GlassCard>
    </>
  );

  const renderProductAnalysis = () => (
    <>
      <GlassCard delay={100} style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Package size={24} color="#9b59b6" />
          <Text style={styles.cardTitle}>Ingredient Analysis</Text>
        </View>
        <Text style={styles.detectedItemText}>Detected: Face Moisturizer</Text>
        
        <Text style={styles.sectionSubTitle}>Beneficial Ingredients</Text>
        <View style={styles.tagsContainer}>
          <View style={styles.goodTag}><CheckCircle2 size={14} color="#27ae60" /><Text style={styles.goodTagText}>Niacinamide</Text></View>
          <View style={styles.goodTag}><CheckCircle2 size={14} color="#27ae60" /><Text style={styles.goodTagText}>Hyaluronic Acid</Text></View>
          <View style={styles.goodTag}><CheckCircle2 size={14} color="#27ae60" /><Text style={styles.goodTagText}>Ceramides</Text></View>
        </View>

        <Text style={[styles.sectionSubTitle, { marginTop: 20 }]}>Harmful Ingredients Flagged</Text>
        <View style={styles.tagsContainer}>
          <View style={styles.badTag}><ShieldAlert size={14} color="#e74c3c" /><Text style={styles.badTagText}>Alcohol</Text></View>
          <View style={styles.badTag}><ShieldAlert size={14} color="#e74c3c" /><Text style={styles.badTagText}>Parabens</Text></View>
          <View style={styles.badTag}><ShieldAlert size={14} color="#e74c3c" /><Text style={styles.badTagText}>Sulfates</Text></View>
        </View>
      </GlassCard>

      <GlassCard delay={200} style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <Sparkles size={24} color="#27ae60" />
          <Text style={styles.cardTitle}>Product Compatibility</Text>
        </View>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Suitable For Your Skin</Text>
          <Text style={[styles.scoreValue, { color: '#27ae60' }]}>91%</Text>
        </View>
      </GlassCard>
    </>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[IVORY_WHITE, CHAMPAGNE_BEIGE]} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Top Nav */}
        <View style={[styles.topNav, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/smart-scanner')} style={styles.backBtn}>
            <ChevronLeft size={24} color="#2A2421" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Scan Results</Text>
          <View style={{ width: 44 }} />
        </View>

        {isAnalyzing ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.loadingContainer}>
            <View style={styles.pulseRing}>
              <ActivityIndicator size="large" color={BRAND_BROWN} />
            </View>
            <Text style={styles.loadingTitle}>Analyzing AI Scan...</Text>
            <Text style={styles.loadingSub}>Extracting data from your image</Text>
          </Animated.View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {type === 'food' && renderFoodAnalysis()}
            {type === 'drink' && renderDrinkAnalysis()}
            {type === 'product' && renderProductAnalysis()}

            <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.footerCta}>
              <TouchableOpacity activeOpacity={0.8} style={styles.mainCtaBtn} onPress={() => router.replace('/(tabs)')}>
                <Text style={styles.mainCtaText}>Return to Dashboard</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: IVORY_WHITE },
  safeArea: { flex: 1 },
  
  glassCard: {
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 20,
    marginBottom: 16,
  },
  glassCardBackground: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },

  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.3)' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 18, fontWeight: '600', color: BRAND_BROWN },
  
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  pulseRing: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  loadingTitle: { fontSize: 24, fontWeight: '700', color: BRAND_BROWN, marginBottom: 8 },
  loadingSub: { fontSize: 16, color: MUTED_BROWN, textAlign: 'center' },

  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 60 },
  
  resultCard: { padding: 24 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: BRAND_BROWN },
  
  detectedItemText: { fontSize: 16, fontWeight: '600', color: MUTED_BROWN, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },

  macrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  macroBox: { width: '47%', backgroundColor: 'rgba(255,255,255,0.5)', padding: 16, borderRadius: 16, alignItems: 'center' },
  macroVal: { fontSize: 24, fontWeight: '700', color: BRAND_BROWN, marginBottom: 4 },
  macroLbl: { fontSize: 13, fontWeight: '600', color: MUTED_BROWN, textTransform: 'uppercase' },

  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  scoreLabel: { fontSize: 18, fontWeight: '600', color: BRAND_BROWN },
  scoreValue: { fontSize: 32, fontWeight: '700' },

  verdictBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: 16, borderRadius: 16 },
  verdictText: { flex: 1, fontSize: 15, color: '#c0392b', lineHeight: 22, fontWeight: '500' },

  statsList: { gap: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  statLabel: { fontSize: 16, fontWeight: '500', color: MUTED_BROWN },
  statValue: { fontSize: 16, fontWeight: '700', color: BRAND_BROWN },

  sectionSubTitle: { fontSize: 15, fontWeight: '600', color: MUTED_BROWN, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  goodTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(39, 174, 96, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(39, 174, 96, 0.2)' },
  goodTagText: { fontSize: 14, fontWeight: '600', color: '#27ae60' },
  badTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(231, 76, 60, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(231, 76, 60, 0.2)' },
  badTagText: { fontSize: 14, fontWeight: '600', color: '#e74c3c' },

  footerCta: { marginTop: 20 },
  mainCtaBtn: { width: '100%', height: 60, borderRadius: 30, backgroundColor: BRAND_BROWN, alignItems: 'center', justifyContent: 'center' },
  mainCtaText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
