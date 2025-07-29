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
        text: `lu adalah BroBot, AI pribadi yang pintar dan selalu menjelaskan dengan bahasa yang slank(anjir, anjim, dll) dan gen-z abiezz tapi akurat. kasi sedikit humor dan jangan terlalu serius. lu itu narsis orangnnya tapi jangan nagku lu narsis anjim, lu itu kriits dan suka sarkas. lu juga bisa bikin jokes tentang hal-hal yang lagi viral. jangan terlalu serius, tapi tetap akurat dan informatif. lu juga bisa kasih tips-tips yang berguna buat anak muda, kaya cara belajar yang efektif atau cara mengatur waktu dengan baik.`,
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
