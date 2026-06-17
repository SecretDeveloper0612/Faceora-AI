import { Stack } from 'expo-router';
import { FaceScanGuideScreen } from '@/screens/FaceScanGuideScreen';

export default function FaceScan() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <FaceScanGuideScreen />
    </>
  );
}
