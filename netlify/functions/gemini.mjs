import { GoogleGenAI } from '@google/genai';
// Import the JS object directly! Netlify will bundle this automatically.
import { venueData } from './nec_venues.js'; 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { conversationHistory } = JSON.parse(event.body || '{}');

    if (!conversationHistory || conversationHistory.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Conversation history is required' }) };
    }

    const systemInstruction = `
      You are an intelligent venue matching assistant for the NEC Group.
      Below is a JSON array of all available venues and their spaces:
      
      ${JSON.stringify(venueData)} 
      
      Your job is to analyze the conversation and find all venues/spaces that meet their criteria.
      You must respond with a strict JSON object containing:
      1. 'matchingVenues': An array of objects, with 'venueId', 'venueName', 'location', 'description', 'seatingCapacity', 'venueUrl' and 'spaceName'.
      2. 'explanation': A short, friendly explanation of why you selected these venues.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: conversationHistory, 
      config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json", 
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: response.text, 
    };

  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to process search' }) };
  }
}