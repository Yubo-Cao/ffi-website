"use client";

import { Lesson, setLearningProgress } from "@/lib/course";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export type ReadContentProps = {
  userId: string;
  lesson: Lesson;
};

export function ReadingContent({ userId, lesson }: ReadContentProps) {
  const [hasCompleted, setHasCompleted] = useState(false);
  const lessonId = lesson.id;

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

      if (progress > 80 && !hasCompleted) {
        setHasCompleted(true);
        try {
          setLearningProgress(userId, lessonId, "Completed").catch((error) => {
            console.error("Failed to update learning progress:", error);
          });
        } catch (error) {
          console.error("Failed to update learning progress:", error);
        }
      }
    } catch (error) {
      console.error("Error in scroll handler:", error);
    }
  }, [hasCompleted, userId, lessonId]);

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
