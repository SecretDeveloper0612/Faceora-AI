import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GoalsInputScreen } from '@/screens/GoalsInputScreen';

export default function GoalsInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <GoalsInputScreen onContinue={(goals) => {
        console.log(`Goals: ${goals.join(', ')}`);
        // Navigate to the next step: Face Exercise Experience
        router.push({ pathname: '/face-exercise-input', params: { ...params, goals: goals.join(',') } });
      }} />
    </>
  );
}
