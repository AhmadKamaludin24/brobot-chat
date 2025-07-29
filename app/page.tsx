"use client";

import MarkdownRenderer from "@/lib/renderCodeBlock";
import { LoaderIcon, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Define a shared type for clarity and type safety
export type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setloading] = useState(false);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      role: "user",
      parts: [{ text: input }],
    };

    try {
      setloading(true);
      const updatedMessages: ChatMessage[] = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput("");
      // Setelah setMessages(updatedMessages);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "" }],
        },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Update the last model message with streaming text
        setMessages((prevMessages) => {
          const updated = [...prevMessages];
          const lastIndex = updated.length - 1;

          updated[lastIndex] = {
            ...updated[lastIndex],
            parts: [{ text: accumulatedText }],
          };

          return updated;
        });
      }
      console.log("Streaming complete:", accumulatedText);
    } catch (error) {
      console.log(error);
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="relative max-h-screen w-full overflow-x-scroll bg-white">
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col justify-between">
        {/* Chat Area */}
        <div className="pt-24 relative px-4 flex-1 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex w-full ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-2xl whitespace-pre-line ${
                  m.role === "user"
                    ? "max-w-[75%] bg-gray-200 text-black"
                    : "max-w-[100%] text-black"
                }`}
              >
                {m.role === "model" ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <MarkdownRenderer content={m.parts[0]?.text || ""} />
                  </div>
                ) : (
                  <div>{m.parts[0]?.text || ""}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 w-full bg-white border-t p-4">
          <form
            onSubmit={handleSend}
            className="w-full flex gap-2 max-w-4xl mx-auto border rounded-lg bg-gray-100 shadow-md p-4"
          >
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full min-h-12 max-h-32 resize-none  border-none rounded-lg focus:outline-none"
              placeholder="Ketik pesanmu di sini..." 
            />
            <div className="flex items-start">
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-black rounded-full hover:bg-gray-800 transition"
              >
                {loading ? (
                  <span className="animate-spin text-white"><LoaderIcon className="animate-spin" /></span>
                ) : (
                  <Send className="text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
