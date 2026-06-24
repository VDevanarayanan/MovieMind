import axios from 'axios';
import { config } from '../config';

interface GeminiContent {
  role: string;
  parts: Array<{ text: string }>;
}

export const generateRecommendationsWithGemini = async (prompt: string) => {
  const url = `${config.geminiApiUrl}?key=${config.geminiApiKey}`;
  
  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
    },
  };

  const response = await axios.post(url, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
