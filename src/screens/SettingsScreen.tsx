import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, Moon, Globe, Shield, Lock, LogOut, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

const IVORY_WHITE = '#F8F6F4';
const CHAMPAGNE_BEIGE = '#E8DDD6';
const PREMIUM_DARK = '#2A2421';

export function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>Preferences</Text>
            <View style={styles.settingsCard}>
              <SettingToggle 
                icon={<Bell size={22} color={PREMIUM_DARK} />} 
                label="Notifications" 
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
              <View style={styles.divider} />
              <SettingToggle 
                icon={<Moon size={22} color={PREMIUM_DARK} />} 
                label="Dark Mode" 
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
              <View style={styles.divider} />
              <SettingLink 
                icon={<Globe size={22} color={PREMIUM_DARK} />} 
                label="Language" 
                value="English"
                onPress={() => {}} 
              />
            </View>
          </View>

          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>Account</Text>
            <View style={styles.settingsCard}>
              <SettingLink 
                icon={<Shield size={22} color={PREMIUM_DARK} />} 
                label="Privacy" 
                onPress={() => {}} 
              />
              <View style={styles.divider} />
              <SettingLink 
                icon={<Lock size={22} color={PREMIUM_DARK} />} 
                label="Security" 
                onPress={() => {}} 
              />
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingToggle({ icon, label, value, onValueChange }: { icon: React.ReactNode, label: string, value: boolean, onValueChange: (val: boolean) => void }) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>{icon}</View>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: '#D1C8C3', true: '#8C776B' }}
        thumbColor={'#FFFFFF'}
      />
    </View>
  );
}

function SettingLink({ icon, label, value, onPress }: { icon: React.ReactNode, label: string, value?: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingIconContainer}>{icon}</View>
      <Text style={styles.settingLabel}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: PREMIUM_DARK,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  settingsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6A5F58',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(140, 119, 107, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: PREMIUM_DARK,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    color: '#6A5F58',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 16,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});
