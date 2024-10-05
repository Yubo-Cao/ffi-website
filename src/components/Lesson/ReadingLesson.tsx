import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import { Lesson, ReadingLesson, setLesson as updateLesson } from "@/lib/course";
import { MdCheck } from "react-icons/md";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownComponentProps = {
  content: string;
  isEditing: boolean;
  onEditToggle: () => void;
  lesson: ReadingLesson;
  setLesson: (lesson: Lesson) => void;
};

export default function ReadingComponent({
  content,
  isEditing,
  onEditToggle,
  lesson,
  setLesson,
}: MarkdownComponentProps) {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    updateLesson({ ...lesson, content: editedContent })
      .then(() => {
        setLesson({ ...lesson, content: editedContent });
        onEditToggle();
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to update lesson.");
      });
  };

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
        <div className="prose lg:prose-lg">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
