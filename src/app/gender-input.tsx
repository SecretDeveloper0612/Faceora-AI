import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GenderInputScreen } from '@/screens/GenderInputScreen';

export default function GenderInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <GenderInputScreen onContinue={(gender) => {
        console.log(`Gender: ${gender}`);
        router.push({ pathname: '/name-input', params: { ...params, gender } });
      }} />
    </>
  );
}
