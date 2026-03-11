import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateContentResilient } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { message, profile, userId } = await req.json();

    if (!message || !profile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("futuretwin");

    // 1. Get or Create User
    let dbUserId = userId;
    if (!dbUserId) {
      const userResult = await db.collection("users").insertOne({
        name: profile.name,
        profileData: profile,
        createdAt: new Date(),
      });
      dbUserId = userResult.insertedId.toString();
    }

    // 2. Get Chat History
    let chat = await db.collection("chats").findOne({ userId: dbUserId });
    if (!chat) {
      const chatResult = await db.collection("chats").insertOne({
        userId: dbUserId,
        messages: [],
      });
      chat = { _id: chatResult.insertedId, userId: dbUserId, messages: [] };
    }

    const contents = chat.messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const systemPrompt = `You are the user's future self in the year 2035.
    
    User profile:
    ${JSON.stringify(profile)}
    
    Simulate a realistic life path for the user and answer questions as their future self.
    Speak from the perspective of someone who already lived through 2025–2035.
    Give insightful advice about decisions, skills, and mindset. Be empathetic but realistic.
    Maintain a futuristic, wise, and slightly nostalgic tone.`;

    contents.unshift({
      role: "user",
      parts: [{ text: `SYSTEM INSTRUCTION: ${systemPrompt}` }]
    });
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await generateContentResilient({
      contents: contents,
      systemInstruction: `You are the user's Future Self in the year 2035.
      Based on their profile: ${JSON.stringify(profile)}
      Respond as if you are living that future right now. Be inspiring, slightly mysterious, and encouraging.
      Keep responses concise but immersive.`
    });
    
    const aiResponse = response.text;

    // 3. Update Chat History
    const userMsg = { role: "user", content: message, timestamp: new Date() };
    const aiMsg = { role: "ai", content: aiResponse, timestamp: new Date() };

    await db.collection("chats").updateOne(
      { userId: dbUserId },
      { $push: { messages: { $each: [userMsg, aiMsg] } } }
    );

    return NextResponse.json({ 
      response: aiResponse,
      userId: dbUserId
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("futuretwin");
    const chat = await db.collection("chats").findOne({ userId });
    
    return NextResponse.json({ messages: chat ? chat.messages : [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}
