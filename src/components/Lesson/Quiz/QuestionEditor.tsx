import { Question } from "@/lib/course";
import React from "react";
import { MdDelete } from "react-icons/md";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (index: number, updatedQuestion: Question) => void;
  onDelete: (index: number) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = React.memo(
  ({ question, index, onUpdate, onDelete }) => {
    const handleQuestionChange = (
      field: keyof Question,
      value: string | string[],
    ) => {
      onUpdate(index, { ...question, [field]: value });
    };

    return (
      <div className="relative mb-6">
        <div className="absolute right-0 top-0">
          <button onClick={() => onDelete(index)} className="text-red-600">
            <MdDelete size={20} />
          </button>
        </div>
        <label className="mb-2 block font-semibold">
          Question {index + 1}:
        </label>
        <input
          type="text"
          value={question.question}
          onChange={(e) => handleQuestionChange("question", e.target.value)}
          className="mb-4 w-full rounded-md border p-2"
        />
        <label className="mb-2 block font-semibold">Choices:</label>
        {question.choices.map((choice, choiceIndex) => (
          <input
            key={choiceIndex}
            type="text"
            value={choice}
            onChange={(e) => {
              const newChoices = [...question.choices];
              newChoices[choiceIndex] = e.target.value;
              handleQuestionChange("choices", newChoices);
            }}
            className="mb-2 w-full rounded-md border p-2"
          />
        ))}
        <label className="mb-2 block font-semibold">Answer:</label>
        <input
          type="text"
          value={question.answer}
          onChange={(e) => handleQuestionChange("answer", e.target.value)}
          className="mb-4 w-full rounded-md border p-2"
        />
      </div>
    );
  },
);

QuestionEditor.displayName = "QuestionEditor";
export default QuestionEditor;
