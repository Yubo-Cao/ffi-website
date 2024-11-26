"use client";

import { Lesson } from "@/lib/course";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });
export type ReadContentProps = {
  lesson: Lesson;
  onComplete: () => void;
};

export function ReadingContent({ lesson, onComplete }: ReadContentProps) {
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

      if (progress > 80 && !hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasCompleted, onComplete]);

  return (
    <div className="container">
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkMath]}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
