"use client";

import { useState } from "react";
import { Messages } from "./Messages";
import { NewChart } from "./NewChart";
import { fetchAiResponse } from "../services/mutation/fetchStreamingResponse";
import { Markdown } from "./Markdown";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Role = "user" | "bot";

interface Message {
  role: Role;
  parts: { text: string }[];
}

const ChatPage = () => {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { user } = useAuth();
  if (!user) {
    router.replace("/login");
  }

  const handleSendMessage = async (text: string) => {
    setIsPending(true);
    setIsError(false);
    setResponse("");

    // Add user's message immediately
    setChatHistory((prev) => [
      ...prev,
      {
        role: "user",
        parts: [{ text }],
      },
    ]);

    let fullResponse = "";

    try {
      await fetchAiResponse(text, (chunk: string) => {
        fullResponse += chunk;
        setResponse(fullResponse); // Update UI with live streamed content
      });

      // After stream ends, save bot message
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          parts: [{ text: fullResponse }],
        },
      ]);
    } catch (err) {
      console.error("Streaming error:", err);
      setIsError(true);
    } finally {
      setIsPending(false);
      setResponse("");
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 w-full max-w-4xl px-4 py-4">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <Image
              src="/logo2.jpg"
              alt="Logo"
              className="w-24 h-24 mb-4"
              width={220}
              height={220}
            />
            <h1 className="text-2xl font-bold">Welcome to AKAI</h1>
            <p className="text-gray-500">
              Ask me anything! I will generate a chart for you.
            </p>
          </div>
        )}

        <Messages history={chatHistory} />

        {/* Show bot typing message if streaming */}
        {response && (
          <div className="flex flex-col gap-2">
            <Markdown content={response} />
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="flex flex-col gap-2">
            <div className="p-5 rounded-2xl max-w-[80%] bg-red-100 text-red-800">
              Something went wrong. Please try again.
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="sticky bottom-2 w-full bg-white py-3 rounded-2xl shadow-md">
          <NewChart onSend={handleSendMessage} isPending={isPending} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
