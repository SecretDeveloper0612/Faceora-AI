import { Stack } from 'expo-router';
import { SmartScannerHomeScreen } from '@/screens/SmartScannerHomeScreen';

export default function SmartScanner() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <SmartScannerHomeScreen />
    </>
  );
}
