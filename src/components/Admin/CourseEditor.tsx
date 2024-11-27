"use client";

import { Button } from "../ui/button";
import { Course } from "@/lib/course";
import { Save } from "lucide-react";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";

interface CourseEditorProps {
  course: Course;
  onUpdateCourse: (course: Course) => void;
}

const CourseEditor: React.FC<CourseEditorProps> = ({
  course,
  onUpdateCourse,
}) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);

  const handleSave = () => {
    onUpdateCourse({ ...course, title, description });
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="mb-4 text-xl font-bold">Edit Course</h2>
      <div className="mb-4">
        <label className="block font-medium">Title</label>
        <input
          className="w-full p-2 border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Description</label>
        <Textarea
          className="w-full p-2 border"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <Button onClick={handleSave}>
        <Save /> Save
      </Button>
    </div>
  );
};

export default CourseEditor;
