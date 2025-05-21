import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decode = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
    if (!decode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json(
        { error: "No content provided" },
        { status: 400 }
      );
    }

    const response = await genAI.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: content }] }],
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
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
