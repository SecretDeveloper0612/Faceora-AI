import { Stack, router } from 'expo-router';
import { NameInputScreen } from '@/screens/NameInputScreen';

export default function NameInput() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <NameInputScreen onContinue={(name) => {
        // Pass name to the next step
        console.log('User name entered:', name);
        router.push({ pathname: '/age-input', params: { name } });
      }} />
    </>
  );
}
