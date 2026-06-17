import { Stack, router, useLocalSearchParams } from 'expo-router';
import { WaterIntakeInputScreen } from '@/screens/WaterIntakeInputScreen';

export default function WaterIntakeInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <WaterIntakeInputScreen onContinue={(intake) => {
        console.log(`Water Intake: ${intake}`);
        // Navigate to the next step: Sleep Hours
        router.push({ pathname: '/sleep-hours-input', params: { ...params, water: intake } });
      }} />
    </>
  );
}
