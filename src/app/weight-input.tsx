import { Stack, router, useLocalSearchParams } from 'expo-router';
import { WeightInputScreen } from '@/screens/WeightInputScreen';

export default function WeightInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <WeightInputScreen onContinue={(weight, unit) => {
        console.log(`Weight: ${weight} ${unit}`);
        router.push({ pathname: '/goals-input', params: { ...params, weight, unit } });
      }} />
    </>
  );
}
