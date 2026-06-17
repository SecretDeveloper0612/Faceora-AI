import { Stack } from 'expo-router';
import { EmailSignInScreen } from '@/screens/EmailSignInScreen';

export default function EmailSignIn() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'slide_from_right' }} />
      <EmailSignInScreen />
    </>
  );
}
