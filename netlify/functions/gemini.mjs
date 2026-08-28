// netlify/functions/gemini.js
import { GoogleGenAI } from '@google/genai';

// A smart way to debug without leaking the whole key!
// const key = process.env.GEMINI_API_KEY || '';
// console.log('JACK SAYS HELLLOOOOO')
// console.log('Key length:', key.length);
// console.log('Key starts with:', key.substring(0, 5));

export async function handler(event) {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // Pass the environment variable directly - no middleman 'key' variable!
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (error) {
    console.error('Error calling Gemini:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate content' }),
    };
  }
}