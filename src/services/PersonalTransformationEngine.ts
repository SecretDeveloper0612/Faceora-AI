// src/services/PersonalTransformationEngine.ts
// Generates a fully personalized 30-day transformation plan via OpenRouter.
// Uses the same qwen models confirmed working for face analysis.

import { OnboardingState } from '@/store/onboardingSlice';
import { AIPlanData } from '@/store/planSlice';
import { FaceAnalysisResult } from '@/store/faceAnalysisSlice';

const ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const PRIMARY_MODEL = 'meta/llama-3.3-70b-instruct';
const FALLBACK_MODEL = 'meta/llama-3.1-8b-instruct';

function buildPrompt(
  profile: OnboardingState,
  bmi: number,
  faceAnalysis?: FaceAnalysisResult | null,
  previousPlan?: AIPlanData | null
): string {
  // Calculate recommended water intake: base 35ml/kg + 500ml for activity
  const recommendedWaterMl = Math.round((profile.weight * 35 + 500) / 100) * 100;
  const recommendedWaterL = (recommendedWaterMl / 1000).toFixed(1);

  // Estimate recommended sleep based on heuristic age from DOB
  const estimatedAge = faceAnalysis?.estimatedFaceAge ?? 25;
  const targetSleepHours = estimatedAge < 18 ? 9 : estimatedAge < 26 ? 8 : 7.5;

  const faceSection = faceAnalysis
    ? `Face Shape: ${faceAnalysis.faceShape}
Skin Type: ${faceAnalysis.skinType}
Estimated Face Age: ${faceAnalysis.estimatedFaceAge} years
Faceora Score: ${faceAnalysis.overallFaceScore}/100
Skin Health: ${faceAnalysis.scores.skinHealth}/100
Hydration Score: ${faceAnalysis.scores.hydration}/100
Jawline Score: ${faceAnalysis.scores.jawline}/100
Symmetry Score: ${faceAnalysis.scores.symmetry}/100
Aging Score: ${faceAnalysis.scores.aging}/100
Skin Concerns: ${faceAnalysis.concerns.length > 0 ? faceAnalysis.concerns.map(c => `${c.name} (${c.severity} severity)`).join(', ') : 'None detected'}
Positive Features: ${faceAnalysis.positiveFeatures.join(', ') || 'N/A'}
AI Recommendations: ${faceAnalysis.recommendations.join('; ')}`
    : 'No face analysis data available. Generate plan based on user profile and goals only.';

  const progressSection = previousPlan
    ? `\n═══════════════════════════════════\nPREVIOUS PLAN PROGRESS\n═══════════════════════════════════\nUser had a previous Faceora Score of ${previousPlan.faceoraScore}. Analyze their current face analysis and compare it to their past plan. Celebrate any improvements (like better hydration or improved skin health) or acknowledge areas that still need work. Create a "progressSummary" message (2-3 sentences) directly addressing the user.`
    : '';

  return `You are Faceora AI — an advanced personal wellness coach, skincare consultant, face fitness trainer, hydration coach, and nutrition advisor.

Generate a fully personalized 30-day transformation plan for this user. Every recommendation must be tailored to their unique profile, skin concerns, and goals.${progressSection}

═══════════════════════════════════
USER PROFILE
═══════════════════════════════════
Name: ${profile.name}
Gender: ${profile.gender}
Height: ${profile.height} cm
Weight: ${profile.weight} kg
BMI: ${bmi.toFixed(1)}
Goals: ${profile.goals.join(', ')}
Food Preference: ${profile.foodPreference}
Current Water Habits: ${profile.waterIntake}
Sleep Hours: ${profile.sleepHours}
Sleep Time: ${profile.sleepTime}
Wake Time: ${profile.wakeTime}
Face Exercise Experience: ${profile.faceExerciseExperience}

═══════════════════════════════════
FACE ANALYSIS DATA
═══════════════════════════════════
${faceSection}

═══════════════════════════════════
PLAN GENERATION RULES
═══════════════════════════════════
1. DIET PLAN
   - Match food preference: ${profile.foodPreference}
   - Match goals: ${profile.goals.join(', ')}
   - BMI is ${bmi.toFixed(1)} — ${bmi > 25 ? 'suggest lower-calorie, high-protein options' : bmi < 18.5 ? 'suggest calorie-dense healthy foods' : 'suggest balanced nutrition'}
   - For "Reduce Face Fat": low sodium, low sugar, high protein, anti-inflammatory foods
   - For "Glow Up" / "Better Skin": Vitamin C, antioxidants, collagen-boosting foods
   - For "Sharper Jawline": protein-rich foods, reduce bloating foods
   - Provide 2-3 specific meal options per meal time (breakfast, lunch, dinner, snacks)

2. WATER PLAN
   - Daily goal: ${recommendedWaterL}L (${recommendedWaterMl}ml) based on weight
   - Create 6 timed reminders spread through the day (7AM to 9PM)
   - Each reminder: specific time + specific ml amount

3. FACE EXERCISE PLAN (4 weeks progressive)
   - Week 1: Beginner exercises tailored to face shape (${faceAnalysis?.faceShape ?? 'general'}) and jawline score (${faceAnalysis?.scores.jawline ?? 70}/100)
   - Week 2: Intermediate progression
   - Week 3: Advanced combinations
   - Week 4: Mastery level + maintenance
   - Each exercise: name, duration, sets (3), step-by-step instructions, difficulty
   - Focus on: ${profile.goals.includes('sharper_jawline') || profile.goals.includes('Sharper Jawline') ? 'jawline definition' : 'overall facial tone'}
   - Provide 3 exercises per week

4. SKIN CARE PLAN
   - Based on skin type: ${faceAnalysis?.skinType ?? 'Combination'}
   - Morning: 4-5 steps (cleanser, toner if needed, vitamin C, moisturizer, SPF)
   - Night: 4-5 steps (cleanser, treatment serum, eye cream if dark circles, moisturizer)
   - Address specific concerns: ${faceAnalysis?.concerns.map(c => c.name).join(', ') || 'general skin health'}

5. SLEEP PLAN
   - Target: ${targetSleepHours} hours
   - Bed time: ${profile.sleepTime || '10:30 PM'}
   - Wake time: ${profile.wakeTime || '6:00 AM'}
   - Provide 4 specific sleep optimization recommendations

6. DAILY CHECKLIST
   - 7-8 actionable daily tasks based on the full plan
   - Concise, action-oriented (e.g. "Drink 3.2L water", "Do 3 face exercises", "Apply SPF before going out")

7. FACEORA SCORE
   - Calculate an overall wellness score (0-100) based on current habits vs goals
   - Consider: current water intake, sleep hours, BMI, face scores

═══════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════
Return ONLY valid JSON. No markdown, no backticks, no thinking, no extra text.

{
  "faceoraScore": 78,
  "progressSummary": "Great job! Your hydration score improved by 10 points since your last scan. Let's keep the momentum going.",
  "dietPlan": {
    "breakfast": ["meal 1", "meal 2", "meal 3"],
    "lunch": ["meal 1", "meal 2", "meal 3"],
    "dinner": ["meal 1", "meal 2", "meal 3"],
    "snacks": ["snack 1", "snack 2", "snack 3"]
  },
  "waterPlan": {
    "dailyGoal": ${recommendedWaterMl},
    "dailyGoalLabel": "${recommendedWaterL}L",
    "reminders": [
      { "time": "7:00 AM", "amount": "500ml" },
      { "time": "9:30 AM", "amount": "300ml" },
      { "time": "12:30 PM", "amount": "500ml" },
      { "time": "3:30 PM", "amount": "400ml" },
      { "time": "6:30 PM", "amount": "400ml" },
      { "time": "9:00 PM", "amount": "200ml" }
    ]
  },
  "exercisePlan": {
    "week1": [
      { "name": "Exercise Name", "duration": "30 seconds", "sets": 3, "instructions": "Step by step instructions here", "difficulty": "Beginner" }
    ],
    "week2": [],
    "week3": [],
    "week4": []
  },
  "skinCarePlan": {
    "morning": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."],
    "night": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ...", "Step 5: ..."]
  },
  "sleepPlan": {
    "targetHours": ${targetSleepHours},
    "targetHoursLabel": "${targetSleepHours} Hours",
    "idealSleepTime": "${profile.sleepTime || '10:30 PM'}",
    "idealWakeTime": "${profile.wakeTime || '6:00 AM'}",
    "recommendations": ["tip 1", "tip 2", "tip 3", "tip 4"]
  },
  "dailyChecklist": ["task 1", "task 2", "task 3", "task 4", "task 5", "task 6", "task 7"]
}`;
}

async function callOpenRouter(
  prompt: string,
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://faceora.app',
      'X-Title': 'Faceora AI',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are Faceora AI, an advanced AI wellness coach. Always respond in valid JSON format only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Nvidia plan error (${response.status}): ${err}`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content returned from Nvidia for plan generation');
  return content;
}

function parsePlanResponse(raw: string): AIPlanData {
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // strip qwen thinking blocks
    .trim();

  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`No JSON found in plan response: ${cleaned.substring(0, 300)}`);
  }

  const parsed = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));

  // Normalize and fill defaults for any missing fields
  const exercisePlan = parsed.exercisePlan ?? parsed.faceExercisePlan ?? {};

  return {
    faceoraScore: Math.min(100, Math.max(0, Number(parsed.faceoraScore ?? parsed.wellnessScore ?? 75))),
    progressSummary: parsed.progressSummary,

    dietPlan: {
      breakfast: parsed.dietPlan?.breakfast ?? [],
      lunch: parsed.dietPlan?.lunch ?? [],
      dinner: parsed.dietPlan?.dinner ?? [],
      snacks: parsed.dietPlan?.snacks ?? [],
    },

    waterPlan: {
      dailyGoal: Number(parsed.waterPlan?.dailyGoal ?? 2500),
      dailyGoalLabel: parsed.waterPlan?.dailyGoalLabel ?? `${((parsed.waterPlan?.dailyGoal ?? 2500) / 1000).toFixed(1)}L`,
      reminders: Array.isArray(parsed.waterPlan?.reminders) ? parsed.waterPlan.reminders : [],
    },

    exercisePlan: {
      week1: Array.isArray(exercisePlan.week1) ? exercisePlan.week1 : [],
      week2: Array.isArray(exercisePlan.week2) ? exercisePlan.week2 : [],
      week3: Array.isArray(exercisePlan.week3) ? exercisePlan.week3 : [],
      week4: Array.isArray(exercisePlan.week4) ? exercisePlan.week4 : [],
    },

    skinCarePlan: {
      morning: Array.isArray(parsed.skinCarePlan?.morning) ? parsed.skinCarePlan.morning : [],
      night: Array.isArray(parsed.skinCarePlan?.night) ? parsed.skinCarePlan.night : [],
    },

    sleepPlan: {
      targetHours: Number(parsed.sleepPlan?.targetHours ?? 8),
      targetHoursLabel: parsed.sleepPlan?.targetHoursLabel ?? `${parsed.sleepPlan?.targetHours ?? 8} Hours`,
      idealSleepTime: parsed.sleepPlan?.idealSleepTime ?? '10:30 PM',
      idealWakeTime: parsed.sleepPlan?.idealWakeTime ?? '6:00 AM',
      recommendations: Array.isArray(parsed.sleepPlan?.recommendations) ? parsed.sleepPlan.recommendations : [],
    },

    dailyChecklist: Array.isArray(parsed.dailyChecklist) ? parsed.dailyChecklist : [],
  };
}

export class PersonalTransformationEngine {
  static async generatePlan(
    profile: OnboardingState,
    bmi: number,
    faceAnalysis?: FaceAnalysisResult | null,
    previousPlan?: AIPlanData | null
  ): Promise<AIPlanData> {
    const apiKey = process.env.EXPO_PUBLIC_NVIDIA_API_KEY || '';
    if (!apiKey) {
      throw new Error('Nvidia API key missing. Set EXPO_PUBLIC_NVIDIA_API_KEY in .env');
    }

    const prompt = buildPrompt(profile, bmi, faceAnalysis, previousPlan);
    console.log('[PlanEngine] Generating plan with model:', PRIMARY_MODEL);

    let rawContent: string;
    try {
      rawContent = await callOpenRouter(prompt, PRIMARY_MODEL, apiKey);
      console.log('[PlanEngine] Primary model succeeded');
    } catch (primaryErr) {
      console.warn('[PlanEngine] Primary model failed, trying fallback:', primaryErr);
      rawContent = await callOpenRouter(prompt, FALLBACK_MODEL, apiKey);
      console.log('[PlanEngine] Fallback model succeeded');
    }

    console.log('[PlanEngine] Raw response (first 300 chars):', rawContent.substring(0, 300));
    const plan = parsePlanResponse(rawContent);
    console.log('[PlanEngine] Plan parsed successfully. faceoraScore:', plan.faceoraScore);
    return plan;
  }
}
