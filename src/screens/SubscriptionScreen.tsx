import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, ArrowLeft, ScanFace, Apple, Package, Infinity, Bot, FileText, Sparkles, ShieldBan } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const WARM_NUDE = '#D7C1B3';

const PREMIUM_GOLD = '#D4AF37';
const PREMIUM_DARK = '#2A2421';

export function SubscriptionScreen() {
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(20);

  const freeCardOpacity = useSharedValue(0);
  const freeCardTranslateY = useSharedValue(30);

  const premiumCardOpacity = useSharedValue(0);
  const premiumCardTranslateY = useSharedValue(30);

  const ctaOpacity = useSharedValue(0);
  const ctaTranslateY = useSharedValue(30);

  const crownFloat = useSharedValue(0);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    headerTranslateY.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) });

    freeCardOpacity.value = withDelay(300, withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }));
    freeCardTranslateY.value = withDelay(300, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    premiumCardOpacity.value = withDelay(500, withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }));
    premiumCardTranslateY.value = withDelay(500, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    ctaOpacity.value = withDelay(700, withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) }));
    ctaTranslateY.value = withDelay(700, withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) }));

    crownFloat.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(4, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }]
  }));

  const freeCardStyle = useAnimatedStyle(() => ({
    opacity: freeCardOpacity.value,
    transform: [{ translateY: freeCardTranslateY.value }]
  }));

  const premiumCardStyle = useAnimatedStyle(() => ({
    opacity: premiumCardOpacity.value,
    transform: [{ translateY: premiumCardTranslateY.value }]
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: ctaTranslateY.value }]
  }));

  const crownStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: crownFloat.value }]
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={PREMIUM_DARK} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.headerSection, headerStyle]}>
            <Animated.View style={crownStyle}>
              <Crown size={48} color={PREMIUM_GOLD} strokeWidth={1.5} />
            </Animated.View>
            <Text style={styles.headline}>Unlock Your Full Potential</Text>
            <Text style={styles.subheadline}>Choose the plan that fits your journey to perfect health and skin.</Text>
          </Animated.View>

          {/* Free Tier */}
          <Animated.View style={[styles.tierCard, styles.freeTierCard, freeCardStyle]}>
            <Text style={styles.tierTitle}>Free</Text>
            <Text style={styles.tierSubtitle}>Basic access to essential features</Text>
            <View style={styles.divider} />
            <View style={styles.featureList}>
              <FeatureItem icon={<ScanFace size={20} color="#6A5F58" />} text="1 Face Scan Weekly" />
              <FeatureItem icon={<Apple size={20} color="#6A5F58" />} text="Limited Food Scans" />
              <FeatureItem icon={<Package size={20} color="#6A5F58" />} text="Limited Product Scans" />
            </View>
          </Animated.View>

          {/* Premium Tier */}
          <Animated.View style={[styles.tierCard, styles.premiumTierCard, premiumCardStyle]}>
            <LinearGradient
              colors={['#3A322D', '#1A1614']}
              style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>RECOMMENDED</Text>
            </View>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTierTitle}>Premium</Text>
              <Text style={styles.premiumTierSubtitle}>Everything you need for transformation</Text>
              <View style={styles.premiumDivider} />
              <View style={styles.featureList}>
                <FeatureItem icon={<Infinity size={20} color={PREMIUM_GOLD} />} text="Unlimited Scans" premium />
                <FeatureItem icon={<Bot size={20} color={PREMIUM_GOLD} />} text="AI Coach" premium />
                <FeatureItem icon={<FileText size={20} color={PREMIUM_GOLD} />} text="Detailed Reports" premium />
                <FeatureItem icon={<Sparkles size={20} color={PREMIUM_GOLD} />} text="Advanced Plans" premium />
                <FeatureItem icon={<ShieldBan size={20} color={PREMIUM_GOLD} />} text="Ad Free" premium />
              </View>
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View style={[styles.ctaSection, ctaStyle]}>
            <TouchableOpacity 
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => {
                // Handle upgrade logic here
                console.log('Upgrade to Premium pressed');
              }}
            >
              <LinearGradient
                colors={[PREMIUM_GOLD, '#B8860B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Upgrade to Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>Continue with Free</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({ icon, text, premium = false }: { icon: React.ReactNode, text: string, premium?: boolean }) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIconContainer, premium && styles.premiumFeatureIconContainer]}>
        {icon}
      </View>
      <Text style={[styles.featureText, premium && styles.premiumFeatureText]}>{text}</Text>
      <Check size={16} color={premium ? PREMIUM_GOLD : "#A0958F"} style={styles.checkIcon} />
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
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: PREMIUM_DARK,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6A5F58',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  tierCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
  freeTierCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
  },
  premiumTierCard: {
    borderColor: 'transparent',
    shadowColor: PREMIUM_GOLD,
    shadowOpacity: 0.15,
    position: 'relative',
    overflow: 'hidden',
  },
  tierTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3A322D',
    marginBottom: 4,
  },
  tierSubtitle: {
    fontSize: 14,
    color: '#7A6D65',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumFeatureIconContainer: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#4A423D',
  },
  premiumFeatureText: {
    color: '#FFFFFF',
  },
  checkIcon: {
    marginLeft: 8,
  },
  premiumContent: {
    position: 'relative',
    zIndex: 2,
  },
  premiumTierTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  premiumTierSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  premiumDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  premiumBadge: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    zIndex: 3,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: PREMIUM_GOLD,
    letterSpacing: 1,
  },
  ctaSection: {
    marginTop: 12,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    shadowColor: PREMIUM_GOLD,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    marginBottom: 16,
  },
  primaryButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#6A5F58',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  }
});
