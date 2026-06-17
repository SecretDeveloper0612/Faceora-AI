import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SleepScheduleInputScreen } from '@/screens/SleepScheduleInputScreen';

export default function SleepScheduleInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <SleepScheduleInputScreen onContinue={(time) => {
        console.log(`Sleep Time: ${time}`);
        // Navigate to the next step: Wake Up Schedule
        router.push({ pathname: '/wake-up-schedule-input', params: { ...params, sleepTime: time } });
      }} />
    </>
  );
}
