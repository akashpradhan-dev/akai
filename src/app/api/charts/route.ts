// app/api/chats/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connectToMongoDB } from "../lib/mongodb";
import Chart from "../lib/models/Chart";
import UserChart from "../lib/models/UserChart";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { text } = body;

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  try {
    await connectToMongoDB();

    const newChat = new Chart({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    let userChats = await UserChart.findOne({ userId });

    if (!userChats) {
      userChats = new UserChart({
        userId,
        chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
      });
      await userChats.save();
    } else {
      userChats.chats.push({
        _id: savedChat._id,
        title: text.substring(0, 40),
      });
      await userChats.save();
    }

    return NextResponse.json({ chatId: savedChat._id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating chat" }, { status: 500 });
  }
}
