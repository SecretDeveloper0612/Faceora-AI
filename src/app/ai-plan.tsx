import { Stack } from 'expo-router';
import { AIPlanScreen } from '@/screens/AIPlanScreen';

export default function AIPlan() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <AIPlanScreen />
    </>
  );
}
