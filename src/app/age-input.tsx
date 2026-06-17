import { Stack, router, useLocalSearchParams } from 'expo-router';
import { AgeInputScreen } from '@/screens/AgeInputScreen';

export default function AgeInput() {
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <AgeInputScreen onContinue={(age) => {
        console.log(`User name: ${name}, User age: ${age}`);
        router.push({ pathname: '/height-input', params: { name, age } });
      }} />
    </>
  );
}
