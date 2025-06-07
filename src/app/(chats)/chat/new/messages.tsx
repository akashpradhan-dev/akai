"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MarkdownWithSyntaxHighlight } from "../Markdown";

import { useAuth } from "@/hooks/useAuth";
import { fetchAiResponse } from "@/services/mutation/fetchStreamingResponse";
import { Message } from "./message";
import { InputArea } from "./InputArea";
import { useHistoryMutation } from "@/services/mutation/saveHistory";
import { useMessageMutation } from "@/services/mutation/saveMessage";

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
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState("");
  const { user, loading, token } = useAuth();
  const { isPending, mutate: saveHistory } = useHistoryMutation();
  const { mutate: saveMessage } = useMessageMutation();
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
    if (!token || !user?.id) return;

    setIsLoading(true);
    setIsError(false);
    setResponse("");

    const newUserMessage: Message = { role: "user", parts: [{ text }] };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);

    let fullResponse = "";

    try {
      await fetchAiResponse(
        text,
        token,
        (chunk: string) => {
          fullResponse += chunk;
          setResponse(fullResponse);
        },
        [...updatedHistory.slice(-5)]
      );

      const botMessage: Message = {
        role: "bot",
        parts: [{ text: fullResponse }],
      };
      const finalHistory = [...updatedHistory, botMessage];
      setChatHistory(finalHistory);

      //row per message
      const content = {
        user: newUserMessage,
        bot: botMessage,
      };

      // Save history if it's the first message
      if (!chatId) {
        const title = fullResponse.slice(0, 50).trim();
        saveHistory(
          { title, userId: user.id },
          {
            onSuccess: (data) => {
              const id = data[0]?.id;
              setChatId(id);

              saveMessage({
                chat_id: id,
                content: content,
              });
            },
          }
        );
      } else {
        saveMessage({
          chat_id: chatId,
          content: content,
        });
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
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
        <InputArea
          onSend={handleSendMessage}
          onClear={() => setChatHistory([])}
          isPending={isPending || isLoading}
        />
      </div>
    </div>
  );
};
