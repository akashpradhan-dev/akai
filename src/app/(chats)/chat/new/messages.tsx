"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { NewChart } from "../NewChart";
import { MarkdownWithSyntaxHighlight } from "../Markdown";

import { useAuth } from "@/hooks/useAuth";
import { fetchAiResponse } from "@/app/services/mutation/fetchStreamingResponse";
import { supabase } from "@/utils/superbase/client";
import { Message } from "./message";

type Role = "user" | "bot";

interface Message {
  role: Role;
  parts: { text: string }[];
}

export const Messages = () => {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { user, loading, token } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user?.email) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Loading screen
  if (loading || !user?.email) {
    return <div>Checking authentication...</div>;
  }

  // Send message to AI
  const handleSendMessage = async (text: string) => {
    setIsPending(true);
    setIsError(false);
    setResponse("");

    setChatHistory((prev) => [...prev, { role: "user", parts: [{ text }] }]);

    let fullResponse = "";
    if (!token) {
      console.error("Token is missing");
      setIsPending(false);
      return;
    }

    try {
      await fetchAiResponse(
        text,
        token,
        (chunk: string) => {
          fullResponse += chunk;
          setResponse(fullResponse);
        },
        [...chatHistory.slice(-5)]
      );

      // Save chat title if it's the first interaction
      if (chatHistory.length === 0) {
        const title = fullResponse.slice(0, 50).trim();
        const { error } = await supabase
          .from("history")
          .insert({ title, user_id: user.id });
        if (error) {
          console.error("Error saving history:", error);
        }
      }

      // Append AI response to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", parts: [{ text: fullResponse }] },
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
    <div>
      <div className="px-4 min-h-[60vh]">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Image
              src="/logo2.jpg"
              alt="Logo"
              className="w-24 h-24 mb-4 rounded-full"
              width={220}
              height={220}
            />
            <h1 className="text-2xl font-bold">Welcome to AKAI</h1>
            <p className="text-gray-500">
              Ask me anything! I will generate a chart for you.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Message history={chatHistory} />
          </div>
        )}

        {/* Streaming response */}
        {response && (
          <div className="flex flex-col gap-2">
            <MarkdownWithSyntaxHighlight markdownText={response} />
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="p-5 rounded-2xl max-w-[80%] bg-red-100 text-red-800">
            Something went wrong. Please try again.
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-50 bg-background p-4">
        <NewChart
          onSend={handleSendMessage}
          onClear={() => setChatHistory([])}
          isPending={isPending}
        />
      </div>
    </div>
  );
};
