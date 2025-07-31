"use client";

import botLoading from "@/lib/lottie/loading bot.json";
import MarkdownRenderer from "@/lib/renderCodeBlock";
import { cn } from "@/lib/utils";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import {
  BotIcon,
  Copy,
  CopyCheck,
  CopyPlus,
  LoaderIcon,
  Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Define a shared type for clarity and type safety
export type ChatMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export default function Home() {
  console.log(new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }));
  const [date, setdate] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setloading] = useState(false);
  const [coopy, setCoopy] = useState(false);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    // Initialize Lottie animation
    if (!lottieRef.current) return;
    if (lottieRef.current) {
      if (loading) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    } else {
      console.error("Lottie ref is not set");
    }
  }, [loading, lottieRef]); // Ensure this runs only once when the component mounts

  const handleCopy = async (text: string) => {
    try {
      setCoopy(true);
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard:", text);
    } catch (error) {
      console.error("Failed to copy text:", error);
      setCoopy(false);
    } finally {
      setTimeout(() => setCoopy(false), 2000);
    }
  };

  const handleSend = async ( e: React.FormEvent ) => {

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

      setloading(false);

      if (!response.body) return;
      setdate(
        new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );

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

  const handleSendWelcome = async ( input: string ) => {

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

      setloading(false);

      if (!response.body) return;
      setdate(
        new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );

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
    <main className="relative max-h-svh w-full overflow-y-scroll bg-white">
      <div className="fixed top-0 w-full px-2 py-4 flex gap-2 border-b-2 border-black bg-gray-200 z-50">
        <BotIcon />
        <h1 className="text-lg font-bold">Brobot Chat</h1>
      </div>
      <div className="max-w-4xl mx-auto min-h-svh flex flex-col relative justify-between items-center">
        {messages.length < 1 ? (
          <>
            <div className="py-24 w-full max-w-4xl relative px-4 flex justify-center items-center min-h-screen">
              <div className="p-4 w-full h-[400px] border border-b-4 border-black bg-gray-400 rounded-2xl flex gap-3 flex-col">
                <h1 className="text-2xl font-bold text-center p-4 bg-cyan-400 rounded-2xl border border-l-4 border-b-4 border-black">
                  Welcome To Brobot Chat!
                </h1>
                <div className="font-semibold text-center p-4 bg-amber-400 h-full rounded-2xl border border-l-4 border-b-4 border-black">
                  <h1>what can i help u with?</h1>
                  <div className="h-full w-full mt-2 flex flex-col items-center justify-center gap-2">
                    <div className="flex w-full justify-between gap-4">
                      <button onClick={() => handleSendWelcome("ide konten")} className="p-2 border w-1/2 border-l-4 border-b-4 border-black rounded-lg">Ide konten</button>
                      <button onClick={() => handleSendWelcome("Rekomendasi Film")} className="p-2 border w-1/2 border-l-4 border-b-4 border-black rounded-lg">Rekomendasi Film</button>
                    </div>
                    <div className="flex w-full justify-between gap-4">
                      <button onClick={() => handleSendWelcome("Selesaikan Tugas Coding")} className="p-2 border w-1/2 border-l-4 border-b-4 border-black rounded-lg">Selesaikan Tugas Coding</button>
                      <button onClick={() => handleSendWelcome("Tanya Jawab")} className="p-2 border w-1/2 border-l-4 border-b-4 border-black rounded-lg">Tanya Jawab</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-24 w-full max-w-4xl relative px-4 flex-1 overflow-y-auto space-y-4">
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
                      ? "max-w-[75%] bg-cyan-500 border-2 border-r-4 border-black border-b-4 text-black"
                      : "max-w-[100%] text-black "
                  }`}
                >
                  {m.role === "model" ? (
                    <div>
                      {i === messages.length - 1 && loading ? (
                        <div className="w-[90px]  rounded-2xl p-4 bg-amber-500  border-2 border-l-4 border-black border-b-4 ">
                          <Lottie
                            animationData={botLoading}
                            lottieRef={lottieRef}
                            autoplay
                            loop
                          />
                        </div>
                      ) : (
                        <>
                          <div className="prose dark:prose-invert max-w-[100%] rounded-2xl p-4 bg-amber-500  border-2 border-l-4 border-black border-b-4 ">
                            <MarkdownRenderer
                              content={m.parts[0]?.text || ""}
                            />
                          </div>
                          <div className="flex gap-2">
                            <span className="m-2 text-gray-400 text-sm">
                              {date}
                            </span>
                            <button
                              onClick={() => handleCopy(m.parts[0]?.text || "")}
                            >
                              {coopy ? (
                                <CopyCheck className="m-2 text-green-500 w-[15px]" />
                              ) : (
                                <Copy className="m-2 text-gray-400 w-[15px]" />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className=" px-2 rounded-l-2xl rounded-tr-2xl ">
                      {m.parts[0]?.text || ""}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="fixed bottom-0 max-w-4xl w-full flex justify-center px-4 py-2 bg-white border-t-2 border-gray-200">
          <form
            onSubmit={handleSend}
            className="w-full flex gap-2 max-w-4xl border rounded-lg bg-gray-100 border-b-4 border-black p-4"
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
                  <span className="animate-spin text-white">
                    <LoaderIcon className="animate-spin" />
                  </span>
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
