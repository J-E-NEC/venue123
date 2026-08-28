// netlify/functions/gemini.js
import { GoogleGenAI } from '@google/genai';

// A smart way to debug without leaking the whole key!
// const key = process.env.GEMINI_API_KEY || '';
// console.log('JACK SAYS HELLLOOOOO')
// console.log('Key length:', key.length);
// console.log('Key starts with:', key.substring(0, 5));

const ai = new GoogleGenAI({ apiKey: key });

export async function handler(event, context) {
  // 1. Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 2. Parse the prompt sent from your frontend
    const { prompt } = JSON.parse(event.body || '{}');

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    // 3. Initialize Gemini SDK using the secret env var
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    // 4. Return the result safely to your frontend
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