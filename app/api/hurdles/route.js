import { NextResponse } from "next/server";
import { generateContentResilient } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Missing profile" }, { status: 400 });
    }

    const systemPrompt = `You are a Stratetic Foresight AI specializing in risk mitigation for the year 2025-2035.
    
    User profile:
    ${JSON.stringify(profile)}
    
    Based on their current age, interests, and profession, identify 3 critical hurdles they might face in achieving their 2035 goals.
    For each hurdle, provide:
    1. A clear name (e.g., "The Technical Obsolescence Trap")
    2. A description of the risk.
    3. A mitigation strategy (practical advice).
    4. A 'Risk Level' (Low, Medium, High).
    
    Format the response as JSON:
    {
      "hurdles": [
        { "name": "...", "description": "...", "mitigation": "...", "riskLevel": "High" }
      ]
    }`;

    const response = await generateContentResilient({
      contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
    });

    const text = response.text;
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    const data = JSON.parse(jsonStr);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Hurdles API Error:", error);
    return NextResponse.json({ error: "Failed to analyze hurdles" }, { status: 500 });
  }
}
