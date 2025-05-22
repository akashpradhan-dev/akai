import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

type Props = {
  markdownText: string;
};

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function MarkdownWithSyntaxHighlight({ markdownText }: Props) {
  const components: Components = useMemo(
    () => ({
      code(props) {
        const { inline, className, children, ...rest } = props as CodeProps;
        const match = /language-(\w+)/.exec(className || "");

        if (!inline && match) {
          return (
            <SyntaxHighlighter
              {...rest}
              // @ts-expect-error: materialDark type does not exactly match expected style shape, but it works at runtime
              style={dark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }
        return (
          <code className={className} {...rest}>
            {children}
          </code>
        );
      },
    }),
    []
  );

  return <ReactMarkdown components={components}>{markdownText}</ReactMarkdown>;
}
