
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { messages: userMessages} = await req.json();

  const systemMessage = {
    role: "user",
    parts: [
      {
        text: "Kamu adalah Brobot, sebuah chatbot AI yang ramah dan memakai bahasa yang gaul misalnya lo gw ",
      },
    ],
  };
  const messages = [systemMessage, ...userMessages];
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const stream = await model.generateContentStream({ contents: messages });

  const encoder = new TextEncoder();
  let botResponse = "";


  // Simpan ke database
  
  
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream.stream) {
        const text = chunk.text();
        botResponse += text; // Kumpulkan untuk disimpan
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
