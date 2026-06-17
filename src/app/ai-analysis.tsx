import { Stack } from 'expo-router';
import { AIAnalysisScreen } from '@/screens/AIAnalysisScreen';

export default function AIAnalysis() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <AIAnalysisScreen />
    </>
  );
}
