import { Button } from "../ui/button";
import { imageCommand } from "./ImageCommand";
import { Lesson } from "@/lib/course";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface LessonEditorProps {
  lesson: Lesson;
  onUpdateLesson: (lesson: Lesson) => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  lesson,
  onUpdateLesson,
}) => {
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content || "");

  const handleSave = () => {
    onUpdateLesson({ ...lesson, title, content });
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="mb-4 text-xl font-bold">Edit Lesson</h2>
      <div className="mb-4">
        <label className="block font-medium">Title</label>
        <input
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {lesson.type === "reading" && (
        <div className="mb-4">
          <label className="block font-medium">Content</label>
          <MDEditor
            value={content}
            onChange={setContent}
            className="min-h-[50vh]"
            previewOptions={{
              rehypePlugins: [[rehypeKatex, rehypeRaw]],
              remarkPlugins: [[remarkGfm, remarkMath]],
            }}
            extraCommands={[imageCommand]}
          />
        </div>
      )}
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default LessonEditor;
