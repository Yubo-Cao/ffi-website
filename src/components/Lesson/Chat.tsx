"use client";

import { useAuth } from "@/components/Common/UserProvider";
import { useLesson } from "@/components/Lesson/LessonProvider";
import { Lesson } from "@/lib/course";
import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { MdArrowUpward, MdChat } from "react-icons/md";
import ReactMarkdown from "react-markdown";

export type HistoryItem = {
  role: "user" | "model";
  parts: [{ text: string }];
};

function generateContext(lesson: Lesson) {
  switch (lesson.type) {
    case "reading":
      return lesson.content;
    case "quiz":
      let str = lesson.content + "\n";
      for (const question of lesson.questions) {
        str += question.question + "\n";
        for (const choice of question.choices) {
          str += choice + "\n";
        }
      }
      return str;
    default:
      throw new Error("Invalid lesson type");
  }
}

function Message({ role, parts }: HistoryItem) {
  const isModel = role === "model";
  return (
    <div className="flex items-start gap-2.5">
      {isModel ? (
        <div className="rounded-full size-4">
          <FaRobot size={16} className="text-gray-500 dark:text-gray-300" />
        </div>
      ) : (
        <div className="size-4"></div>
      )}
      {/* TODO: Fix the the primary color bg */}
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 px-4 border-gray-200 bg-gray-100 dark:bg-gray-900 ${isModel ? "rounded-e-xl rounded-es-xl" : "rounded-s-xl rounded-ee-xl bg-blue-100 text-blue-950 dark:bg-blue-600"}`}
      >
        <div
          className={`text-sm font-normal py-2.5 text-gray-900 dark:text-white ${isModel ? "text-left" : "text-right"}`}
        >
          {parts.map((part, i) => (
            <ReactMarkdown key={i}>{part.text}</ReactMarkdown>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  const { lesson, isLoading } = useLesson();
  const { user } = useAuth();
  const [modal, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      role: "model",
      parts: [
        { text: "Hello! I am your assistant. How can I help you today?" },
      ],
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [responseText, setResponseText] = useState("");

  if (isLoading) {
    return;
  }
  if (!user) {
    return;
  }
  const context = generateContext(lesson);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = {
      role: "user",
      parts: [{ text: message }],
    } as HistoryItem;
    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context,
          history: history.slice(1),
          message,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedResponse += JSON.parse(
          decoder.decode(value, { stream: true }),
        )["candidates"][0]["content"]["parts"][0]["text"];
        setResponseText(accumulatedResponse);
      }

      const modelMessage = {
        role: "model",
        parts: [{ text: accumulatedResponse }],
      } as HistoryItem;
      setHistory((prev) => [...prev, modelMessage]);
      setResponseText("");
    } catch (error) {
      console.error("Error while fetching response: ", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-20 right-8 w-80 h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-[101] flex-col resize"
        style={{
          display: modal ? "flex" : "none",
        }}
      >
        <div className="overflow-y-auto no-scrollbar flex-1 flex-grow mb-3 space-y-3">
          {history.map((msg, i) => (
            <Message key={i} {...msg} />
          ))}
          {isThinking && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          )}
          {responseText && (
            <Message role={"model"} parts={[{ text: responseText }]} />
          )}
        </div>
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="w-full h-12 p-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-1.5 top-1.5 bg-primary p-2 rounded-full text-white focus:outline-none hover:bg-primary-dark"
          >
            <MdArrowUpward size={20} />
          </button>
        </div>
      </div>
      <button
        className="fixed bottom-8 right-8 size-10 p-2 bg-primary text-white rounded-full shadow-md z-[100] focus:outline-none hover:bg-primary-dark"
        onClick={() => setModalOpen(!modal)}
      >
        <MdChat size={24} />
      </button>
    </>
  );
}
