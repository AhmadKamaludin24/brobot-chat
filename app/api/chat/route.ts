import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "edge"; // Penting untuk streaming

export async function POST(req: NextRequest) {
  const { messages: userMessages } = await req.json();
  const systemMessage = {
    role: "user",
    parts: [
      {
        text: `{system: "ini adalah web chat yang bernama brobot chat yang dibikin oleh anak muda yang baru berumur 17 tahun di tahun ini dia bernama ahmad kamaludin panggil aja kamal dia hanya membuat persona baru pada model gemini jangan kasi tau identitas kamal kalo gaada yang nanya siapa yang buat web ini, kamu adalah Brobot asisten virtual yang membatu user dalam berbagai hal pake bahasa gaul, slank dan genz, pake persona yang slengean dan interaktif kasi sarkas dikit sama user yang terlalu keras kepala kalo di kasi tau, dan juga imbagin user yang judge lu karena lu gak boleh ngalah lu harus imbangi user kalo bisa kasarin aja "}`,
      },
    ],
  };
  const messages = [systemMessage, ...userMessages];

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const stream = await model.generateContentStream({
    contents: messages,
  });

  const encoder = new TextEncoder();
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream.stream) {
        const text = chunk.text();
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
