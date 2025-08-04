// lib/renderMessage.tsx
"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeBlockProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const renderCodeBlock = ({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return !inline && match ? (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 px-2 py-1 text-xs rounded bg-gray-700 text-white opacity-0 group-hover:opacity-100 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        customStyle={{
          padding: "1rem",
          borderRadius: "0.5rem",
          fontSize: "0.9rem",
          background: "#1e1e1e",
          borderBottom: "15px solid black",
          borderLeft: "10px solid black",
          borderStartEndRadius: "1rem",
          borderStartStartRadius: "1rem",
          borderEndEndRadius: "1rem",
          borderEndStartRadius: "1rem",
        }}
        wrapLongLines
        showLineNumbers
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code className="bg-black text-white text-sm px-1 py-1 ">{children}</code>
  );
};

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code: renderCodeBlock,
        ul: ({ children }) => (
          <ul
            className="list-disc  space-y-1"
            style={{
              paddingLeft: "1.5rem", // fallback kalau Tailwind gak kena
              listStyleType: "disc",
            }}
          >
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol
            className="list-decimal pl-6 space-y-1"
            style={{
              paddingLeft: "1.5rem",
              listStyleType: "decimal",
            }}
          >
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-sm leading-relaxed">{children}</li>
        ),
         a: ({ children, href }) => (
          <a href={href} style={{cursor: "pointer"}} className="text-sm leading-relaxed cursor-pointer p-2 rounded-2xl bg-black text-white">{children}</a>
        ),
        h1: ({ children }) => (
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginTop: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              marginTop: "1.25rem",
              marginBottom: "0.75rem",
            }}
          >
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginTop: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            {children}
          </h3>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
