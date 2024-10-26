"use client";

import { BaseChat } from "./BaseChat";
import { useState } from "react";
import React from "react";
import { MdChat } from "react-icons/md";

interface FloatingChatProps {
  context?: string;
}

export const FloatingChat: React.FC<FloatingChatProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-20 right-8 w-80 h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-[101] flex-col resize"
        style={{
          display: isOpen ? "flex" : "none",
        }}
      >
        <BaseChat context={context} />
      </div>
      <button
        className="fixed bottom-8 right-8 size-10 p-2 bg-primary text-white rounded-md shadow-md z-[100] focus:outline-none hover:bg-primary-dark"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdChat size={24} />
      </button>
    </>
  );
};
