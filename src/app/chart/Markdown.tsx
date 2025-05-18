"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Components } from "react-markdown";

// Define a component to handle copy functionality
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};

// Define the MarkdownRenderer component
export const Markdown = ({ content }: { content: string }) => {
  const components: Components = {
    code({ inline = false, className, children, ...props }) {
      const language = className?.replace("language-", "") || "";
      const codeText = String(children).trim();

      if (inline) {
        return (
          <code className="bg-gray-200 px-1 rounded text-sm">{children}</code>
        );
      }

      return (
        <div className="relative group my-4">
          <CopyButton text={codeText} />
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            PreTag="div"
            {...props}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
};
