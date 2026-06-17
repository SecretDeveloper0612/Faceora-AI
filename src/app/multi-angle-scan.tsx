import { Stack } from 'expo-router';
import { MultiAngleFaceScanScreen } from '@/screens/MultiAngleFaceScanScreen';

export default function MultiAngleScan() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <MultiAngleFaceScanScreen />
    </>
  );
}
