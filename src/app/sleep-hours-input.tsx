import { Stack, router, useLocalSearchParams } from 'expo-router';
import { SleepHoursInputScreen } from '@/screens/SleepHoursInputScreen';

export default function SleepHoursInput() {
  const params = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <SleepHoursInputScreen onContinue={(hours) => {
        console.log(`Sleep Hours: ${hours}`);
        // Navigate to the next step: Sleep Schedule (Time Picker)
        router.push({ pathname: '/sleep-schedule-input', params: { ...params, sleepHours: hours } });
      }} />
    </>
  );
}
