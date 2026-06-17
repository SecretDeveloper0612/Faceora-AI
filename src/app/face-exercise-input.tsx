import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FaceExerciseInputScreen } from '@/screens/FaceExerciseInputScreen';

export default function FaceExerciseInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <FaceExerciseInputScreen onContinue={(level) => {
        console.log(`Face Exercise Experience: ${level}`);
        // Navigate to the next step: Food Preference
        router.push({ pathname: '/food-preference-input', params: { ...params, experience: level } });
      }} />
    </>
  );
}
