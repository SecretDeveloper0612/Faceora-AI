const fs = require('fs');

async function testNvidia() {
  const apiKey = process.env.EXPO_PUBLIC_NVIDIA_API_KEY || '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';

  console.log("Testing text model...");
  const textRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [{ role: 'user', content: 'Say hello in JSON' }],
      max_tokens: 4000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    }),
  });
  console.log('Text Model:', textRes.status, await textRes.text());

  console.log("Testing vision model...");
  const pixelBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const visionRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'meta/llama-3.2-90b-vision-instruct',
      messages: [
        { role: 'user', content: [
          { type: 'text', text: 'What is this?' },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${pixelBase64}` } },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${pixelBase64}` } }
        ]}
      ],
      max_tokens: 1500,
      temperature: 0.1,
    }),
  });
  console.log('Vision Model:', visionRes.status, await visionRes.text());
}

testNvidia();
