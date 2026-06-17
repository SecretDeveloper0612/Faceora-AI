// src/store/faceAnalysisSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SkinConcern {
  name: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
}

export interface FaceScores {
  skinHealth: number;
  hydration: number;
  symmetry: number;
  jawline: number;
  aging: number;
}

export interface FaceAnalysisResult {
  // Core identifiers
  scanId?: string;
  createdAt?: string;

  // AI Analysis fields
  faceShape: string;
  skinType: string;
  estimatedFaceAge: number;
  overallFaceScore: number;

  // Sub-scores
  scores: FaceScores;

  // Detailed findings
  concerns: SkinConcern[];
  positiveFeatures: string[];
  recommendations: string[];

  // Image URIs (local or remote)
  imageUris?: {
    front?: string;
    left?: string;
    right?: string;
  };
}

export interface PendingImages {
  front: string | null;
  left: string | null;
  right: string | null;
}

export interface FaceAnalysisState {
  result: FaceAnalysisResult | null;
  pendingImages: PendingImages;
  isAnalyzing: boolean;
  error: string | null;
}

const initialState: FaceAnalysisState = {
  result: null,
  pendingImages: { front: null, left: null, right: null },
  isAnalyzing: false,
  error: null,
};

export const faceAnalysisSlice = createSlice({
  name: 'faceAnalysis',
  initialState,
  reducers: {
    setResult(state, action: PayloadAction<FaceAnalysisResult>) {
      state.result = action.payload;
      state.isAnalyzing = false;
      state.error = null;
    },
    clearResult(state) {
      state.result = null;
      state.error = null;
    },
    setPendingImage(state, action: PayloadAction<{ angle: keyof PendingImages; base64: string }>) {
      // Guard: pendingImages may be undefined if old persisted state is rehydrated
      if (!state.pendingImages) {
        state.pendingImages = { front: null, left: null, right: null };
      }
      state.pendingImages[action.payload.angle] = action.payload.base64;
    },
    clearPendingImages(state) {
      state.pendingImages = { front: null, left: null, right: null };
    },
    setAnalyzing(state, action: PayloadAction<boolean>) {
      state.isAnalyzing = action.payload;
    },
    setAnalysisError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isAnalyzing = false;
    },
  },
});

export const {
  setResult,
  clearResult,
  setPendingImage,
  clearPendingImages,
  setAnalyzing,
  setAnalysisError,
} = faceAnalysisSlice.actions;

export default faceAnalysisSlice.reducer;
