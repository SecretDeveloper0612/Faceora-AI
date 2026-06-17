import { Stack, router, useLocalSearchParams } from 'expo-router';
import { HeightInputScreen } from '@/screens/HeightInputScreen';

export default function HeightInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <HeightInputScreen onContinue={(height, unit) => {
        console.log(`Height: ${height} ${unit}`);
        router.push({ pathname: '/weight-input', params: { ...params, height, unit } });
      }} />
    </>
  );
}
