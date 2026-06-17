import { Stack } from 'expo-router';
import { FaceScanGuideScreen } from '@/screens/FaceScanGuideScreen';

export default function FaceScanGuide() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <FaceScanGuideScreen />
    </>
  );
}
