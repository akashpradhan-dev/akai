"use client";

import { useEffect, useState } from "react";
import { Messages } from "./Messages";
import { NewChart } from "./NewChart";
import { fetchAiResponse } from "../services/mutation/fetchStreamingResponse";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Layout from "./customlayout";
import { MarkdownWithSyntaxHighlight } from "./Markdown";

type Role = "user" | "bot";

interface Message {
  role: Role;
  parts: { text: string }[];
}
const MAX_CHAT_MESSAGES = 20;

const ChatPage = () => {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [response, setResponse] = useState("");
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [currentChatCount, setCurrentChatCount] = useState(0);
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  const { user, loading, token } = useAuth();

  useEffect(() => {
    if (!loading && !user?.email) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const storedCount = localStorage.getItem("chatCount");
    if (storedCount) {
      try {
        const count = JSON.parse(storedCount);
        if (typeof count === "number" && count >= 0) {
          setCurrentChatCount(count); // Set the loaded count
          if (count >= MAX_CHAT_MESSAGES) {
            setShowLimitMessage(true);
          }
        } else {
          console.warn(
            "Stored chat count is malformed or not a valid number. Resetting to 0."
          );
          localStorage.setItem("chatCount", JSON.stringify(0)); // Reset bad data
          setCurrentChatCount(0);
          setShowLimitMessage(false);
        }
      } catch (e) {
        console.error("Failed to parse chat count from localStorage:", e);
        localStorage.setItem("chatCount", JSON.stringify(0)); // Clear corrupted data
        setCurrentChatCount(0);
        setShowLimitMessage(false);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatCount", JSON.stringify(currentChatCount));

    // Update showLimitMessage based on current chat count
    if (currentChatCount >= MAX_CHAT_MESSAGES) {
      setShowLimitMessage(true);
    } else {
      setShowLimitMessage(false);
    }
  }, [currentChatCount]);

  if (loading || !user?.email) {
    return <div>Checking authentication...</div>;
  }

  const handleSendMessage = async (text: string) => {
    if (currentChatCount >= MAX_CHAT_MESSAGES) {
      setShowLimitMessage(true); // Ensure message is visible
      return; // Stop function execution
    }

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
    if (!token) {
      console.error("Token is missing");
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

      // After stream ends, save bot message
      setChatHistory((prev) => [
        ...prev,
        {
          role: "bot",
          parts: [{ text: fullResponse }],
        },
      ]);

      setCurrentChatCount((prevCount) => prevCount + 1);
    } catch (err) {
      console.error("Streaming error:", err);
      setIsError(true);
    } finally {
      setIsPending(false);
      setResponse("");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex-1 w-full max-w-4xl px-4 py-4">
          {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
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
          )}

          <Messages history={chatHistory} />

          {/* Show bot typing message if streaming */}
          {response && (
            <div className="flex flex-col gap-2">
              <MarkdownWithSyntaxHighlight markdownText={response} />
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

          {/* Chat Limit Message */}
          {showLimitMessage && (
            <div className="flex flex-col gap-2 my-2">
              <div className="p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 text-center">
                You have reached the limit of {MAX_CHAT_MESSAGES} messages.
                Please
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="sticky bottom-2 w-full py-3 rounded-2xl shadow-md">
            <NewChart
              onSend={handleSendMessage}
              onClear={() => {
                setChatHistory([]);
                setResponse("");
              }}
              isPending={isPending}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
