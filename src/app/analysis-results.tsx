import { Stack, router } from 'expo-router';
import { AnalysisResultsScreen } from '@/screens/AnalysisResultsScreen';

export default function AnalysisResults() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <AnalysisResultsScreen onBack={() => router.back()} />
    </>
  );
}
