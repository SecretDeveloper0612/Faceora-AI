// src/services/openrouterAI.ts
// Faceora AI - Vision Analysis Service using NVIDIA NIM
// Uses meta/llama-3.2-90b-vision-instruct
// Accepts up to 3 face images (front, left, right) and returns structured JSON

import { FaceAnalysisResult } from '../store/faceAnalysisSlice';

const PRIMARY_MODEL = 'meta/llama-3.2-90b-vision-instruct';
const ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are Faceora AI, an advanced face wellness and skin analysis assistant.

Analyze the provided face image(s) and generate a detailed facial health assessment.

IMPORTANT RULES:
- Do NOT claim medical diagnosis
- Only provide cosmetic and wellness observations  
- Be objective and accurate
- Return ONLY valid JSON, no markdown, no extra text
- Provide realistic confidence scores based on what you can observe
- Base age estimation on visible skin condition, not just appearance

Analyze these 10 dimensions:
1. Face Shape (Oval, Round, Diamond, Square, Heart, Rectangle, Oblong)
2. Skin Type (Dry, Oily, Combination, Sensitive, Normal)
3. Skin Health (texture, clarity, evenness)
4. Facial Symmetry
5. Jawline Definition
6. Hydration Indicators (skin plumpness, moisture signs)
7. Estimated Facial Age (based on skin condition)
8. Skin Concerns (acne, dark circles, wrinkles, pigmentation, etc.)
9. Positive Features (standout strengths)
10. Improvement Suggestions (actionable wellness tips)

Return ONLY this exact JSON structure:
{
  "faceShape": "string",
  "skinType": "string",
  "estimatedFaceAge": number,
  "overallFaceScore": number (0-100),
  "scores": {
    "skinHealth": number (0-100),
    "hydration": number (0-100),
    "symmetry": number (0-100),
    "jawline": number (0-100),
    "aging": number (0-100)
  },
  "concerns": [
    {
      "name": "string",
      "severity": "Low" | "Medium" | "High",
      "confidence": number (0-100)
    }
  ],
  "positiveFeatures": ["string"],
  "recommendations": ["string"]
}`;

function buildImageContent(base64Images: { front: string; left?: string; right?: string }) {
  const content: any[] = [];

  content.push({
    type: 'image_url',
    image_url: { url: `data:image/jpeg;base64,${base64Images.front}` },
  });

  content.push({
    type: 'text',
    text: `Please analyze the front face shown above and return your assessment as the specified JSON only. No explanations, no markdown, just the raw JSON object.`,
  });

  return content;
}

async function callNvidia(
  content: any[],
  model: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content },
      ],
      max_tokens: 1500,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Nvidia API error (${response.status}): ${err}`);
  }

  const json = await response.json();
  const rawContent = json?.choices?.[0]?.message?.content;

  if (!rawContent) {
    console.error('Nvidia response missing content:', JSON.stringify(json));
    throw new Error('No content returned from Nvidia API');
  }

  return rawContent;
}

function parseAIResponse(raw: string): FaceAnalysisResult {
  const cleaned = raw
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '') // strip qwen thinking blocks if any
    .trim();

  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error(`Could not find JSON in AI response: ${cleaned.substring(0, 200)}`);
  }

  const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(jsonStr);

  return {
    faceShape: parsed.faceShape ?? 'Oval',
    skinType: parsed.skinType ?? 'Combination',
    estimatedFaceAge: Number(parsed.estimatedFaceAge) || 25,
    overallFaceScore: Math.min(100, Math.max(0, Number(parsed.overallFaceScore) || 75)),
    scores: {
      skinHealth: Math.min(100, Math.max(0, Number(parsed.scores?.skinHealth) || 70)),
      hydration: Math.min(100, Math.max(0, Number(parsed.scores?.hydration) || 70)),
      symmetry: Math.min(100, Math.max(0, Number(parsed.scores?.symmetry) || 75)),
      jawline: Math.min(100, Math.max(0, Number(parsed.scores?.jawline) || 70)),
      aging: Math.min(100, Math.max(0, Number(parsed.scores?.aging) || 80)),
    },
    concerns: Array.isArray(parsed.concerns)
      ? parsed.concerns.map((c: any) => ({
          name: String(c.name || 'Unknown'),
          severity: (['Low', 'Medium', 'High'].includes(c.severity) ? c.severity : 'Low') as 'Low' | 'Medium' | 'High',
          confidence: Math.min(100, Math.max(0, Number(c.confidence) || 70)),
        }))
      : [],
    positiveFeatures: Array.isArray(parsed.positiveFeatures)
      ? parsed.positiveFeatures.map(String)
      : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.map(String)
      : [],
    scanId: `scan_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

export async function analyzeFaceWithOpenRouter(
  images: { front: string; left?: string; right?: string } | string,
  apiKey: string = process.env.EXPO_PUBLIC_NVIDIA_API_KEY || ''
): Promise<FaceAnalysisResult> {
  if (!apiKey) {
    throw new Error('Nvidia API key is missing. Set EXPO_PUBLIC_NVIDIA_API_KEY in .env');
  }

  const imageObj = typeof images === 'string' ? { front: images } : images;

  console.log('[Faceora AI] Starting analysis with model:', PRIMARY_MODEL);
  
  const content = buildImageContent(imageObj);

  const rawContent = await callNvidia(content, PRIMARY_MODEL, apiKey);
  console.log('[Faceora AI] Nvidia model succeeded');

  console.log('[Faceora AI] Raw response (first 500 chars):', rawContent.substring(0, 500));

  const result = parseAIResponse(rawContent);
  
  return result;
}
