"use server";

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

export async function run({
  context,
  history,
  message,
}: {
  context: string;
  message: string;
  history: { role: "user" | "system"; parts: [{ text: "string" }] }[];
}) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: context }],
      },
      {
        role: "system",
        parts: [
          {
            text: "I have read the provided information and I will answer accordingly.",
          },
        ],
      },
      ...history,
    ],
  });

  const result = await chatSession.sendMessage(message);
  return result.response.text();
}
