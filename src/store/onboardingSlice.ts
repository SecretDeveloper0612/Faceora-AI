import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OnboardingState {
  name: string;
  gender: string;
  dob: string;
  height: number; // cm
  weight: number; // kg
  goals: string[];
  faceExerciseExperience: 'Never' | 'Beginner' | 'Intermediate' | 'Advanced' | '';
  foodPreference: 'Vegetarian' | 'Non Vegetarian' | 'Vegan' | 'Eggetarian' | '';
  waterIntake: 'Less than 1L' | '1-2L' | '2-3L' | '3L+' | '';
  sleepHours: number;
  sleepTime: string;
  wakeTime: string;
}

const initialState: OnboardingState = {
  name: '',
  gender: '',
  dob: '',
  height: 0,
  weight: 0,
  goals: [],
  faceExerciseExperience: '',
  foodPreference: '',
  waterIntake: '',
  sleepHours: 0,
  sleepTime: '',
  wakeTime: '',
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingState>>) => {
      return { ...state, ...action.payload };
    },
    resetOnboarding: () => initialState,
  },
});

export const { updateOnboardingData, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
