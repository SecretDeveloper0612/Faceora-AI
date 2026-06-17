import { supabase } from '@/lib/supabase';
import { OnboardingState } from '@/store/onboardingSlice';
import { AIPlanData } from '@/store/planSlice';
import { FaceAnalysisResult } from '@/store/faceAnalysisSlice';

export class SupabaseService {
  /**
   * Upsert a user profile after onboarding
   */
  static async saveProfile(userId: string, data: OnboardingState, bmi: number) {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name: data.name,
      gender: data.gender,
      dob: data.dob,
      height: data.height,
      weight: data.weight,
      bmi: bmi,
      goals: data.goals,
      food_pref: data.foodPreference,
      water_habits: data.waterIntake,
      sleep_habits: {
        hours: data.sleepHours,
        sleepTime: data.sleepTime,
        wakeTime: data.wakeTime,
      },
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  }

  /**
   * Save the generated AI plan for the user
   */
  static async saveAIPlan(userId: string, plan: AIPlanData) {
    const { data, error } = await supabase.from('ai_plans').insert({
      user_id: userId,
      plan_json: plan,
      created_at: new Date().toISOString(),
    }).select().single();

    if (error) throw error;
    return data;
  }

  /**
   * Save face analysis result to the face_analysis table
   */
  static async saveFaceAnalysis(userId: string, result: FaceAnalysisResult) {
    const { data, error } = await supabase.from('face_analysis').insert({
      user_id: userId,
      scan_id: result.scanId ?? `scan_${Date.now()}`,
      face_shape: result.faceShape,
      skin_type: result.skinType,
      overall_score: result.overallFaceScore,
      skin_health_score: result.scores.skinHealth,
      hydration_score: result.scores.hydration,
      symmetry_score: result.scores.symmetry,
      jawline_score: result.scores.jawline,
      aging_score: result.scores.aging,
      analysis_json: result,
      created_at: result.createdAt ?? new Date().toISOString(),
    }).select().single();

    if (error) {
      console.warn('[SupabaseService] saveFaceAnalysis failed (table may not exist):', error.message);
      return null; // Non-fatal - analysis still works without DB save
    }
    return data;
  }

  /**
   * Upload a face scan image to Supabase Storage
   * Path: face-scans/{userId}/{scanId}/{angle}.jpg
   */
  static async uploadFaceScan(
    userId: string,
    base64Image: string,
    angle: 'front' | 'left' | 'right',
    scanId?: string
  ) {
    const sid = scanId ?? `scan_${Date.now()}`;
    const fileName = `${userId}/${sid}/${angle}.jpg`;

    // Convert base64 to Uint8Array for upload
    const binaryStr = atob(base64Image);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const { error } = await supabase.storage
      .from('face-scans')
      .upload(fileName, bytes, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.warn('[SupabaseService] uploadFaceScan failed:', error.message);
      return null; // Non-fatal
    }

    const { data: { publicUrl } } = supabase.storage
      .from('face-scans')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Fetch the latest AI plan for a user
   */
  static async getLatestPlan(userId: string): Promise<AIPlanData | null> {
    const { data, error } = await supabase
      .from('ai_plans')
      .select('plan_json')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    return data?.plan_json as AIPlanData;
  }

  /**
   * Fetch the creation date of the latest plan
   */
  static async getLatestPlanDate(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('ai_plans')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data?.created_at;
  }

  /**
   * Fetch the latest face analysis for a user
   */
  static async getLatestFaceAnalysis(userId: string): Promise<FaceAnalysisResult | null> {
    const { data, error } = await supabase
      .from('face_analysis')
      .select('analysis_json')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      return null; // Non-fatal if table doesn't exist
    }
    return data?.analysis_json as FaceAnalysisResult;
  }
  /**
   * Save wellness log state to the database
   */
  static async saveWellnessLog(userId: string, dashboardState: any) {
    const { error } = await supabase.from('wellness_logs').upsert({
      user_id: userId,
      log_date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      water_progress: dashboardState.waterProgress,
      sleep_hours: dashboardState.sleepHours,
      exercise_completed: dashboardState.exerciseCompleted,
      checklist: dashboardState.dailyChecklist,
      wellness_score: dashboardState.wellnessScore,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, log_date' });

    if (error) {
      console.warn('[SupabaseService] saveWellnessLog failed (table may not exist):', error.message);
    }
  }
}
