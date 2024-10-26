import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { MdArrowUpward } from "react-icons/md";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface BaseChatProps {
  initialMessage?: string;
  context?: string;
  onClose?: () => void;
  className?: string;
}

const MessageBubble: React.FC<ChatMessage> = ({ role, parts }) => {
  const isModel = role === "model";
  return (
    <div className="flex items-start gap-2.5">
      {isModel && (
        <div className="rounded-full size-4">
          <FaRobot size={16} className="text-gray-500 dark:text-gray-300" />
        </div>
      )}
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 
        ${
          isModel
            ? "bg-gray-100 dark:bg-gray-900 rounded-e-xl rounded-es-xl"
            : "bg-blue-100 dark:bg-blue-600 text-blue-950 dark:text-white rounded-s-xl rounded-ee-xl ml-4"
        }`}
      >
        <div
          className={`text-sm font-normal ${isModel ? "text-left" : "text-right"}`}
        >
          {parts.map((part, i) => (
            <ReactMarkdown key={i}>{part.text}</ReactMarkdown>
          ))}
        </div>
      </div>
    </div>
  );
};

export const BaseChat: React.FC<BaseChatProps> = ({
  initialMessage = "Hello! I am your assistant. How can I help you today?",
  context = "",
  className = "",
}) => {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      parts: [{ text: initialMessage }],
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [responseText, setResponseText] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: message }],
    };

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

      const reader = response.body!.getReader();
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

      const modelMessage: ChatMessage = {
        role: "model",
        parts: [{ text: accumulatedResponse }],
      };
      setHistory((prev) => [...prev, modelMessage]);
      setResponseText("");
    } catch (error) {
      console.error("Error while fetching response: ", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="overflow-y-auto flex-1 space-y-3 mb-3">
        {history.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
        {isThinking && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}
        {responseText && (
          <MessageBubble role="model" parts={[{ text: responseText }]} />
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
          className="w-full h-12 p-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-700 text-sm resize-none
          text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="absolute right-1.5 top-1.5 bg-primary p-2 rounded-full text-white
          focus:outline-none hover:bg-primary-dark"
        >
          <MdArrowUpward size={20} />
        </button>
      </div>
    </div>
  );
};
