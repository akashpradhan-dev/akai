import React, { useEffect, useRef } from "react";
import { MarkdownWithSyntaxHighlight } from "./Markdown";

type Role = "user" | "bot";

interface Message {
  role: Role;
  parts: { text: string }[];
}

interface MessagesProps {
  history: Message[];
}

export const Messages = ({ history }: MessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference to scroll to the bottom

  // Scroll to the bottom whenever the history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]); // Dependency array includes history to trigger scrolling on each update

  return (
    <div className="flex flex-col gap-2">
      {history?.map((message, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div
            className={`p-5 rounded-2xl max-w-[80%] whitespace-pre-wrap ${
              message.role === "user"
                ? "bg-[#2c2937] self-end text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <MarkdownWithSyntaxHighlight markdownText={message.parts[0].text} />
          </div>
        </div>
      ))}
      {/* This div ensures we scroll to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};
