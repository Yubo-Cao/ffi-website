import { NextRequest } from "next/server";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a helpful financial literacy teacher. Read the following article and answer any questions the students may have. You are only allowed to answer academic-related questions. Nothing about information that is not appropriate for high school students.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: NextRequest) {
  try {
    const { context, history, message } = await req.json();

    if (!context || !message || !history) {
      return new Response("Invalid request", { status: 400 });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: context }],
        },
        {
          role: "model",
          parts: [
            {
              text: "I have read the provided information and I will answer accordingly.",
            },
          ],
        },
        ...history,
      ],
    });

    const response = await chatSession.sendMessageStream(message);
    const stream = response.stream;
    const readableStream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of stream) {
          console.log(chunk);
          controller.enqueue(JSON.stringify(chunk));
        }
        controller.close();
      },
    });
    return new Response(readableStream);
  } catch (error) {
    console.error("Error while fetching response: ", error);
    return new Response("Internal server error", { status: 500 });
  }
}
