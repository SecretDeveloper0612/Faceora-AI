import { Stack, router } from 'expo-router';
import { ResultsScreen } from '@/screens/ResultsScreen';

export default function Results() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <ResultsScreen 
        onBack={() => router.back()} 
        onViewFull={() => router.push('/analysis-results')}
        onScanAgain={() => router.back()}
      />
    </>
  );
}
