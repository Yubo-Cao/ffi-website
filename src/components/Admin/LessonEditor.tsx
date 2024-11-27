"use client";

import { Button } from "../ui/button";
import { Lesson } from "@/lib/course";
import React, { useState } from "react";

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
          className="w-full p-2 border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {lesson.type === "reading" && (
        <div className="mb-4">
          <label className="block font-medium">Content</label>
          <textarea
            className="w-full p-2 border"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />
        </div>
      )}
      <Button onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

export default LessonEditor;
