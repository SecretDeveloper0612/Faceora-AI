import { Stack } from 'expo-router';
import { SmartCameraScreen } from '@/screens/SmartCameraScreen';

export default function SmartCamera() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <SmartCameraScreen />
    </>
  );
}
