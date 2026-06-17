import { Tabs } from 'expo-router';
import { Home, ScanFace, Sparkles, TrendingUp, User } from 'lucide-react-native';
import { Platform } from 'react-native';

const PREMIUM_DARK = '#2A2421';
const CHAMPAGNE_BEIGE = '#E8DDD6';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PREMIUM_DARK,
        tabBarInactiveTintColor: '#A0958F',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: CHAMPAGNE_BEIGE,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <ScanFace size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="smart-scanner"
        options={{
          title: 'Smart Scanner',
          tabBarIcon: ({ color }) => <Sparkles size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
