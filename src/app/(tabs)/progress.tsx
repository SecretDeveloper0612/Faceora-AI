import { Stack } from 'expo-router';
import { ProgressScreen } from '@/screens/ProgressScreen';

export default function Progress() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <ProgressScreen />
    </>
  );
}
