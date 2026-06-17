import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DashboardState {
  faceoraScore: number;
  faceoraScoreTrend: number;
  wellnessScore: number;
  waterProgress: number; // liters
  waterGoal: number; // liters
  sleepHours: number;
  sleepGoal: number;
  exerciseCompleted: number;
  exerciseGoal: number;
  streak: number;
  transformationDay: number;
  dailyChecklist: {
    water: boolean;
    morningWash: boolean;
    faceExercise: boolean;
    healthyMeal: boolean;
    sleepGoal: boolean;
  };
  todayAIInsight: string;
}

const initialState: DashboardState = {
  faceoraScore: 84,
  faceoraScoreTrend: 4,
  wellnessScore: 82,
  waterProgress: 2.1,
  waterGoal: 3.0,
  sleepHours: 7,
  sleepGoal: 8,
  exerciseCompleted: 3,
  exerciseGoal: 5,
  streak: 7,
  transformationDay: 7,
  dailyChecklist: {
    water: true,
    morningWash: true,
    faceExercise: false,
    healthyMeal: true,
    sleepGoal: false,
  },
  todayAIInsight: "Your hydration score improved by 8%. Continue drinking 3L water daily.",
};

// Daily Wellness Formula:
// Water Score      = 25%
// Sleep Score      = 25%
// Exercise Score   = 20%
// Face Wash Score  = 15%
// Meal Compliance  = 15%
const recalculateWellness = (state: DashboardState) => {
  let score = 0;
  if (state.waterProgress >= state.waterGoal || state.dailyChecklist.water) score += 25;
  else score += (state.waterProgress / state.waterGoal) * 25;

  if (state.sleepHours >= state.sleepGoal || state.dailyChecklist.sleepGoal) score += 25;
  else score += (state.sleepHours / state.sleepGoal) * 25;

  if (state.exerciseCompleted >= state.exerciseGoal || state.dailyChecklist.faceExercise) score += 20;
  else score += (state.exerciseCompleted / state.exerciseGoal) * 20;

  if (state.dailyChecklist.morningWash) score += 15;
  if (state.dailyChecklist.healthyMeal) score += 15;

  state.wellnessScore = Math.round(score);
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action: PayloadAction<Partial<DashboardState>>) => {
      Object.assign(state, action.payload);
      recalculateWellness(state);
    },
    addWater: (state, action: PayloadAction<number>) => { // amount in liters
      state.waterProgress = Math.min(state.waterGoal, +(state.waterProgress + action.payload).toFixed(2));
      if (state.waterProgress >= state.waterGoal) state.dailyChecklist.water = true;
      recalculateWellness(state);
    },
    toggleChecklistItem: (state, action: PayloadAction<keyof DashboardState['dailyChecklist']>) => {
      state.dailyChecklist[action.payload] = !state.dailyChecklist[action.payload];
      recalculateWellness(state);
    },
    completeExercise: (state) => {
      if (state.exerciseCompleted < state.exerciseGoal) {
        state.exerciseCompleted += 1;
        if (state.exerciseCompleted >= state.exerciseGoal) {
          state.dailyChecklist.faceExercise = true;
        }
        recalculateWellness(state);
      }
    }
  },
});

export const { setDashboardData, addWater, toggleChecklistItem, completeExercise } = dashboardSlice.actions;
export default dashboardSlice.reducer;
