import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Please add your GEMINI_API_KEY to .env.local");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

/**
 * Retries a prompt with multiple fallback models to handle quota issues.
 */
export async function generateContentResilient({ contents, systemInstruction = "" }) {
  // Priority List: Gemini 1.5 Flash (Primary), 1.5 Flash 8B (Speed), 1.5 Pro (Brain)
  // We use these standard IDs as fallbacks. 
  const models = [
    "gemma-3-27b-it",        // 30 RPM, 14.4K RPD
    "gemma-3-12b-it",        // 30 RPM
    "gemma-3-4b-it",         // 30 RPM
    "gemma-3-2b-it",         // 30 RPM
    "gemini-3.1-flash-lite-preview", // 15 RPM, 500 RPD
    "gemini-2.5-flash-lite", // 10 RPM, 20 RPD
    "gemini-2.5-flash",      // 5 RPM, 20 RPD
    "gemini-3-flash-preview", // 5 RPM, 20 RPD
  ];

  let lastError;
  for (const modelId of models) {
    try {
      console.log(`[AI] Attempting generation with model: ${modelId}`);
      
      const response = await ai.models.generateContent({
        model: modelId,
        contents,
        systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } : undefined,
      });
      console.log(`[AI] Success with ${modelId}`);
      return response;
    } catch (error) {
      console.warn(`[AI] Model ${modelId} failed:`, error.message);
      lastError = error;

      const errMsg = error.message?.toLowerCase() || "";
      // If it's a 429 (Resource Exhausted) or 404 (Not Found), try the next model
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("exhausted") || errMsg.includes("404")) {
        continue;
      }

      throw error; // Rethrow if it's a structural error (e.g. invalid auth)
    }
  }

  throw lastError;
}

export default ai;
