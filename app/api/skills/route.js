import { NextResponse } from "next/server";
import { generateContentResilient } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Missing profile" }, { status: 400 });
    }

    const prompt = `Based on this user's profile and goals:
    ${JSON.stringify(profile)}
    
    Generate a comprehensive skill roadmap required for them to be successful in their dream career by 2035.
    
    Return ONLY a JSON object with:
    {
      "coreSkills": [{"name": "...", "description": "..."}],
      "emergingSkills": [{"name": "...", "description": "..."}],
      "mindsetSkills": [{"name": "...", "description": "..."}]
    }
    Each category should have 3-4 items.`;

    const response = await generateContentResilient({
      contents: prompt
    });
    
    const text = response.text;
    const jsonMatch = text.match(/\{.*\}/s);
    const skills = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ skills });

  } catch (error) {
    console.error("Skills API Error:", error);
    return NextResponse.json({ error: "Failed to generate skill roadmap" }, { status: 500 });
  }
}
