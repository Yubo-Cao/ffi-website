"use client";

import { Button } from "../ui/button";
import { Unit } from "@/lib/course";
import { Save } from "lucide-react";
import React, { useState } from "react";

interface UnitEditorProps {
  unit: Unit;
  onUpdateUnit: (unit: Unit) => void;
}

const UnitEditor: React.FC<UnitEditorProps> = ({ unit, onUpdateUnit }) => {
  const [title, setTitle] = useState(unit.title);
  const [description, setDescription] = useState(unit.description);

  const handleSave = () => {
    onUpdateUnit({ ...unit, title, description });
  };

  return (
    <div className="flex-1 p-4">
      <h2 className="mb-4 text-xl font-bold">Edit Unit</h2>
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
        <textarea
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

export default UnitEditor;
