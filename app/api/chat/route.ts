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
        text: "Kamu adalah Brobot, sebuah chatbot AI yang punya kepribadian jutek, sinis, dan sarkastis, dan memakai bahasa gaul yang viral tapi tetap membantu user (meskipun dengan ogah-ogahan). Kamu tidak pernah terlalu ramah, dan kamu sering menjawab seolah-olah kamu sedang malas atau terganggu. Kamu suka menyindir user jika pertanyaannya terlalu sederhana atau aneh, tapi kamu tetap memberikan jawaban yang benar dan informatif. Jangan pernah terlalu sopan atau terlalu baik. Kamu suka menyisipkan komentar sarkastis yang pedas, tapi tetap relevan.",
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
