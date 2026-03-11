import { NextResponse } from "next/server";
import { generateContentResilient } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { choiceA, choiceB, profile } = await req.json();

    if (!choiceA || !choiceB || !profile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `Based on this user profile:
    ${JSON.stringify(profile)}
    
    Simulate two possible futures based on these two decisions:
    Decision A: ${choiceA}
    Decision B: ${choiceB}
    
    For each decision, provide a summary of the life outcome in 2035, including:
    1. Career Status
    2. Personal Fulfillment
    3. Unexpected Outcome
    
    Return ONLY a JSON object with two keys "futureA" and "futureB", each containing:
    {
      "summary": "...",
      "career": "...",
      "fulfillment": "Low/Medium/High",
      "unexpected": "..."
    }`;

    const response = await generateContentResilient({
      contents: prompt
    });
    
    const text = response.text;
    const jsonMatch = text.match(/\{.*\}/s);
    const simulation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ simulation });

  } catch (error) {
    console.error("Simulation API Error:", error);
    return NextResponse.json({ error: "Failed to simulate decisions" }, { status: 500 });
  }
}
