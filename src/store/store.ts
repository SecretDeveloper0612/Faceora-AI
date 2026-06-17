import { configureStore, combineReducers } from '@reduxjs/toolkit';
import faceAnalysisReducer from './faceAnalysisSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from './storage';

import onboardingReducer from './onboardingSlice';
import userReducer from './userSlice';
import planReducer from './planSlice';
import dashboardReducer from './dashboardSlice';

const rootReducer = combineReducers({
  onboarding: onboardingReducer,
  user: userReducer,
  plan: planReducer,
  faceAnalysis: faceAnalysisReducer,
  dashboard: dashboardReducer,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user', 'plan', 'faceAnalysis', 'dashboard'], // Persist face analysis results
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
