import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FoodPreferenceInputScreen } from '@/screens/FoodPreferenceInputScreen';

export default function FoodPreferenceInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <FoodPreferenceInputScreen onContinue={(preference) => {
        console.log(`Food Preference: ${preference}`);
        // Navigate to the next step: Water Intake
        router.push({ pathname: '/water-intake-input', params: { ...params, food: preference } });
      }} />
    </>
  );
}
