import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Exercise Types ────────────────────────────────────────────────────────────
export interface FaceExercise {
  name: string;
  duration: string;
  sets: number;
  instructions: string;
  difficulty: string;
}

// ─── Water Reminder ────────────────────────────────────────────────────────────
export interface WaterReminder {
  time: string;
  amount: string;
}

// ─── Full Plan Data ────────────────────────────────────────────────────────────
export interface AIPlanData {
  faceoraScore: number;
  progressSummary?: string;

  dietPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };

  waterPlan: {
    dailyGoal: number; // ml
    dailyGoalLabel: string; // e.g. "3.2L"
    reminders: WaterReminder[];
  };

  exercisePlan: {
    week1: FaceExercise[];
    week2: FaceExercise[];
    week3: FaceExercise[];
    week4: FaceExercise[];
  };

  skinCarePlan: {
    morning: string[];
    night: string[];
  };

  sleepPlan: {
    targetHours: number;
    targetHoursLabel: string; // e.g. "7.5 Hours"
    idealSleepTime: string;
    idealWakeTime: string;
    recommendations: string[];
  };

  dailyChecklist: string[];

  // Legacy alias kept for backward compat with old persisted state
  faceExercisePlan?: {
    week1: FaceExercise[];
    week2: FaceExercise[];
    week3: FaceExercise[];
    week4: FaceExercise[];
  };

  wellnessScore?: number;
}

// ─── Redux State ──────────────────────────────────────────────────────────────
interface PlanState {
  currentPlan: AIPlanData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlanState = {
  currentPlan: null,
  isLoading: false,
  error: null,
};

export const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setPlan: (state, action: PayloadAction<AIPlanData>) => {
      state.currentPlan = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearPlan: (state) => {
      state.currentPlan = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setPlan, clearPlan, setLoading, setError } = planSlice.actions;
export default planSlice.reducer;
