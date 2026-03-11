import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai'; // Yahan 'google-genai' hona chahiye

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-1.5-flash',
});
