"use client";

import { useEffect, useState } from "react";
import { Messages } from "./Messages";
import { NewChart } from "./NewChart";
import { fetchAiResponse } from "../../services/mutation/fetchStreamingResponse";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Layout from "./customlayout";
import { MarkdownWithSyntaxHighlight } from "./Markdown";
import { supabase } from "@/utils/superbase/client";

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

  const { user, loading, token } = useAuth();

  useEffect(() => {
    if (!loading && !user?.email) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user?.email) {
    return <div>Checking authentication...</div>;
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

      // update the title with 1st message asked
      if (chatHistory.length === 0) {
        const title = fullResponse.slice(0, 50).trim();

        const { error } = await supabase
          .from("history")
          .insert({ title: title, user_id: user.id });
        if (error) {
          console.error("Error saving history:", error);
        }
      }

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
    <Layout>
      <div className="flex flex-col items-center w-full h-screen overflow-hidden">
        {/* Scrollable Content Area */}
        <div className="flex-1 w-full max-w-4xl px-4 py-4 overflow-y-auto mb-40">
          {/* mb-28 adds bottom spacing to avoid overlap with input */}
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
          {/* Bot Typing Message */}
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
        </div>

        {/* Fixed Input Area */}
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-50">
          <div className="bg-background py-3 px-4 rounded-2xl shadow-md w-full">
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
