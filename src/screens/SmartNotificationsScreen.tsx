import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Moon, Droplets, Smile, Camera, Bell, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const BRAND_BROWN = '#2A2421';
const MUTED_BROWN = '#8A7A71';

const NotificationToggleCard = ({ title, subtitle, icon: Icon, color, delay, defaultOn = true }: any) => {
  const [isEnabled, setIsEnabled] = useState(defaultOn);
  
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
    <Animated.View style={[styles.toggleCard, animatedStyle]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        trackColor={{ false: 'rgba(0,0,0,0.1)', true: BRAND_BROWN }}
        thumbColor="#FFF"
        ios_backgroundColor="rgba(0,0,0,0.1)"
        onValueChange={() => setIsEnabled(!isEnabled)}
        value={isEnabled}
      />
    </Animated.View>
  );
};

export function SmartNotificationsScreen() {
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
          <Text style={styles.navTitle}>Daily AI Coach</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
            <View style={styles.heroBadge}>
              <Bell size={14} color="#FFF" />
              <Text style={styles.heroBadgeText}>Smart Reminders</Text>
            </View>
            <Text style={styles.headerTitle}>Customize Your Routine</Text>
            <Text style={styles.headerSubtitle}>
              Our AI coach will notify you exactly when you need to take action for optimal skin health.
            </Text>
          </Animated.View>

          <View style={styles.optionsList}>
            <NotificationToggleCard 
              title="Sleep Reminder"
              subtitle="🌙 Time to sleep (10:30 PM)"
              icon={Moon}
              color="#34495e"
              delay={100}
            />
            
            <NotificationToggleCard 
              title="Water Reminder"
              subtitle="💧 Drink Water (Every 2 hrs)"
              icon={Droplets}
              color="#3498db"
              delay={200}
            />
            
            <NotificationToggleCard 
              title="Face Wash Reminder"
              subtitle="🧴 Face Wash Time (8:00 AM & 9:00 PM)"
              icon={Sparkles}
              color="#9b59b6"
              delay={300}
            />

            <NotificationToggleCard 
              title="Face Exercise Reminder"
              subtitle="😊 Exercise Time (Daily at 2:00 PM)"
              icon={Smile}
              color="#e67e22"
              delay={400}
            />

            <NotificationToggleCard 
              title="Weekly Scan Reminder"
              subtitle="📸 Time for a New Face Scan (Sundays)"
              icon={Camera}
              color="#e74c3c"
              delay={500}
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
  
  header: { marginBottom: 32 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: BRAND_BROWN, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 16 },
  heroBadgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  headerTitle: { fontSize: 32, fontWeight: '700', color: BRAND_BROWN, marginBottom: 12, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 16, color: MUTED_BROWN, lineHeight: 24 },

  optionsList: { gap: 12 },
  
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,1)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10,
  },
  iconContainer: {
    width: 48, height: 48,
    borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: { flex: 1, marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: BRAND_BROWN, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: '#6A5F58', fontWeight: '500' },
});
