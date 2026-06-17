import { Stack } from 'expo-router';
import { ScannerResultsScreen } from '@/screens/ScannerResultsScreen';

export default function ScannerResults() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <ScannerResultsScreen />
    </>
  );
}
