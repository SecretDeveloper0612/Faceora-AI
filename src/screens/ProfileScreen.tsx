import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, HelpCircle, Shield, FileText, ChevronRight, Activity, Award, Flame } from 'lucide-react-native';
import { router } from 'expo-router';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const PREMIUM_DARK = '#2A2421';
const ACCENT_COLOR = '#8C776B';

export function ProfileScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[IVORY_WHITE, CHAMPAGNE_BEIGE]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Jane Doe</Text>
              <Text style={styles.userEmail}>jane.doe@example.com</Text>
            </View>
          </View>

          {/* Physical Attributes */}
          <View style={styles.attributesContainer}>
            <AttributeItem label="Gender" value="Female" />
            <View style={styles.attributeDivider} />
            <AttributeItem label="Age" value="28" />
            <View style={styles.attributeDivider} />
            <AttributeItem label="Height" value="170 cm" />
            <View style={styles.attributeDivider} />
            <AttributeItem label="Weight" value="65 kg" />
          </View>

          {/* Statistics */}
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <StatCard icon={<Activity size={24} color={ACCENT_COLOR} />} label="Total Scans" value="12" />
            <StatCard icon={<Award size={24} color={ACCENT_COLOR} />} label="Avg Score" value="85" />
            <StatCard icon={<Flame size={24} color={'#FF8C00'} />} label="Streak" value="5 Days" />
          </View>

          {/* Navigation Links */}
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.linksContainer}>
            <LinkItem 
              icon={<Settings size={22} color={PREMIUM_DARK} />} 
              label="Settings" 
              onPress={() => router.push('/settings')} 
            />
            <View style={styles.linkDivider} />
            <LinkItem 
              icon={<HelpCircle size={22} color={PREMIUM_DARK} />} 
              label="Help & Support" 
              onPress={() => router.push('/support')} 
            />
            <View style={styles.linkDivider} />
            <LinkItem 
              icon={<Shield size={22} color={PREMIUM_DARK} />} 
              label="Privacy Policy" 
              onPress={() => router.push('/legal?type=privacy')} 
            />
            <View style={styles.linkDivider} />
            <LinkItem 
              icon={<FileText size={22} color={PREMIUM_DARK} />} 
              label="Terms of Service" 
              onPress={() => router.push('/legal?type=terms')} 
            />
          </View>
          
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function AttributeItem({ label, value }: { label: string, value: string }) {
  return (
    <View style={styles.attributeItem}>
      <Text style={styles.attributeLabel}>{label}</Text>
      <Text style={styles.attributeValue}>{value}</Text>
    </View>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LinkItem({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.linkItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.linkIconContainer}>{icon}</View>
      <Text style={styles.linkLabel}>{label}</Text>
      <ChevronRight size={20} color="#A0958F" />
    </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: PREMIUM_DARK,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ACCENT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: PREMIUM_DARK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6A5F58',
  },
  attributesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  attributeItem: {
    alignItems: 'center',
    flex: 1,
  },
  attributeLabel: {
    fontSize: 12,
    color: '#6A5F58',
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: PREMIUM_DARK,
  },
  attributeDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PREMIUM_DARK,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(140, 119, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: PREMIUM_DARK,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6A5F58',
  },
  linksContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  linkIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(140, 119, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkLabel: {
    flex: 1,
    fontSize: 16,
    color: PREMIUM_DARK,
    fontWeight: '500',
  },
  linkDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 12,
  },
  bottomPadding: {
    height: 100,
  }
});
