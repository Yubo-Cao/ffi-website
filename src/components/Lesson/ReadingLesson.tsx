"use client";

import { useEdit } from "@/components/Lesson/EditProvider";
import { setLesson as updateLesson } from "@/lib/course";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { MdCheck } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function ReadingComponent({ content, lesson, setLesson }) {
  const [editedContent, setEditedContent] = useState(content);
  const { isEditing, setIsEditing } = useEdit();

  const handleSave = async () => {
    try {
      await updateLesson({ ...lesson, content: editedContent });
      setLesson({ ...lesson, content: editedContent });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update lesson.");
    }
  };

  if (typeof window === "undefined") {
    return (
      <div className="prose dark:prose-invert">
        <ReactMarkdown
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkMath]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div>
      {isEditing ? (
        <>
          <MDEditor value={editedContent} onChange={setEditedContent} />
          <button
            onClick={handleSave}
            className="mt-4 flex items-center rounded-md bg-primary px-4 py-2 text-white"
          >
            <MdCheck className="mr-2" /> Save
          </button>
        </>
      ) : (
        <div className="prose dark:prose-invert">
          <ReactMarkdown
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkMath]}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
