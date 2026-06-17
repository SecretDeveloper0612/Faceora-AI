import { Stack, router, useLocalSearchParams } from 'expo-router';
import { WakeUpScheduleInputScreen } from '@/screens/WakeUpScheduleInputScreen';

export default function WakeUpScheduleInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <WakeUpScheduleInputScreen onContinue={(time) => {
        console.log(`Wake Up Time: ${time}`);
        // Navigate to the next step: Final Auth Screen
        router.push({ pathname: '/auth', params: { ...params, wakeUpTime: time } });
      }} />
    </>
  );
}
