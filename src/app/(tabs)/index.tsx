import { Stack } from 'expo-router';
import { DashboardScreen } from '@/screens/DashboardScreen';

export default function Dashboard() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <DashboardScreen />
    </>
  );
}
