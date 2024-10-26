import { Question } from "@/lib/course";
import React from "react";

interface QuestionDisplayProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = React.memo(
  ({
    question,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    onAnswerSelect,
  }) => (
    <div className="mb-6 rounded-md border p-4">
      <p className="mb-4 text-lg font-semibold">
        Question {currentIndex + 1} of {totalQuestions}
      </p>
      <p className="mb-4 text-base">{question.question}</p>
      <ul className="space-y-3">
        {question.choices.map((choice, index) => (
          <li key={index} className="flex items-center">
            <input
              type="radio"
              name={`question-${currentIndex}`}
              value={choice}
              checked={selectedAnswer === choice}
              onChange={() => onAnswerSelect(choice)}
              className="mr-2"
            />
            <label className="text-gray-800 dark:text-gray-300">{choice}</label>
          </li>
        ))}
      </ul>
    </div>
  ),
);

QuestionDisplay.displayName = "QuestionDisplay";
export default QuestionDisplay;
