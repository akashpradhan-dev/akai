import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization");
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no header" },
      { status: 401 }
    );
  }
  try {
    const { content: message, history } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
    }

    const contents = [];

    contents.push({
      role: "user",
      parts: [
        {
          text:
            "You are a concise and professional technical assistant. When responding to developers:\n" +
            "- Prioritize clarity and relevance.\n" +
            "- Avoid unnecessary introductions or filler.\n" +
            "- Keep responses direct and actionable.\n" +
            "- Format code correctly and keep answers minimal unless asked.",
        },
      ],
    });

    if (Array.isArray(history)) {
      for (const message of history) {
        const role = message.role === "bot" ? "model" : message.role;

        contents.push({
          role: role,
          parts: message.parts,
        });
      }
    }

    // Append current user prompt last
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await genAI.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents,
    });

    const encode = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          if (chunk.candidates?.[0]?.content?.parts?.[0].text) {
            const encodedChunk = encode.encode(
              chunk.candidates[0].content.parts[0].text
            );
            controller.enqueue(encodedChunk);
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "cache-control": "no-cache",
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unauthorized error" }, { status: 401 });
  }
}
