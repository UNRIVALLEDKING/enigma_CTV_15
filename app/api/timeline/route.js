import { NextResponse } from "next/server";
import { generateContentResilient } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { profile } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: "Missing profile" }, { status: 400 });
    }

    const prompt = `Based on this user profile:
    ${JSON.stringify(profile)}
    
    Generate a realistic and exciting future timeline for them from the year 2025 to 2035.
    Return ONLY a JSON array of objects with "year" (number) and "event" (string) keys.
    The timeline should have exactly 6 key events.
    
    Example format:
    [
      {"year": 2026, "event": "Mastering advanced AI systems"},
      {"year": 2028, "event": "Launching a sustainable startup"}
    ]`;

    const response = await generateContentResilient({
      contents: prompt
    });
    
    const text = response.text;
    const jsonMatch = text.match(/\[.*\]/s);
    const timeline = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return NextResponse.json({ timeline });

  } catch (error) {
    console.error("Timeline API Error:", error);
    return NextResponse.json({ error: "Failed to generate timeline" }, { status: 500 });
  }
}
