import { Stack, router } from 'expo-router';
import { AuthScreen } from '@/screens/AuthScreen';

export default function Auth() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <AuthScreen onAuthenticate={(method) => {
        console.log(`Authenticated with: ${method}`);
        // Navigate to the main Dashboard/Home next
        // router.replace('/dashboard');
      }} />
    </>
  );
}
