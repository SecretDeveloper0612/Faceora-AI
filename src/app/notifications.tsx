import { Stack } from 'expo-router';
import { SmartNotificationsScreen } from '@/screens/SmartNotificationsScreen';

export default function Notifications() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <SmartNotificationsScreen />
    </>
  );
}
