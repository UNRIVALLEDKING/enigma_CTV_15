import { GoogleGenAI } from "@google/genai";
import fs from "fs";

// Manually parse .env.local
const envContent = fs.readFileSync(".env", "utf8");
const match = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.error("API Key not found in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    console.log("Fetching available models...");
    const models = await ai.models.list();
    console.log("Available Models:");
    for await (const m of models) {
      console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods?.join(", ") || "N/A"})`);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
