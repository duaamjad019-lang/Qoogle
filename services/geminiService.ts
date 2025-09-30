
import { GoogleGenAI } from "@google/genai";
import type { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

export const runSearch = async (prompt: string): Promise<SearchResult> => {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }
  
  if (!process.env.API_KEY) {
    // This is a mock response for when the API key is not available.
    await new Promise(res => setTimeout(res, 1000));
    return {
      text: "This is a mock response because the API key is not configured. To enable real search, please provide your Google Gemini API key as an environment variable.",
      sources: [
        { web: { uri: "https://ai.google.dev/", title: "Google AI for Developers" } },
        { web: { uri: "https://blog.google/technology/ai/google-gemini-ai/", title: "Introducing Gemini: our largest and most capable AI model" } }
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { text, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch search results from Gemini API.");
  }
};
