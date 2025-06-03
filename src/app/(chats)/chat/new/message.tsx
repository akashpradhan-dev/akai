import React, { useEffect, useRef } from "react";
import { MarkdownWithSyntaxHighlight } from "../Markdown";

type Role = "user" | "bot";

interface Message {
  role: Role;
  parts: { text: string }[];
}

interface MessageProps {
  history: Message[];
}

export const Message = ({ history }: MessageProps) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom whenever the history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <div className="flex flex-col gap-2">
      {history?.map((message, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div
            className={`p-3 md:p-5 text-sm rounded-2xl max-w-[95%] overflow-x-auto md:max-w-[90%] whitespace-pre-wrap ${
              message.role === "user"
                ? "bg-[#171717] self-end text-white"
                : "border border-[#2c2937]"
            }`}
          >
            <MarkdownWithSyntaxHighlight markdownText={message.parts[0].text} />
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
