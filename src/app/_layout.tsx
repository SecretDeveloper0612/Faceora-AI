import { DarkTheme, DefaultTheme, ThemeProvider , Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { FaceoraSplash } from '@/components/faceora-splash';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <FaceoraSplash />
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
