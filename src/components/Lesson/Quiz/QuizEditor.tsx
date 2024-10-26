import QuestionEditor from "@/components/Lesson/Quiz/QuestionEditor";
import { Question } from "@/lib/course";
import React, { useCallback } from "react";
import { MdAdd, MdCheck } from "react-icons/md";

interface QuizEditorProps {
  questions: Question[];
  onQuestionsUpdate: (questions: Question[]) => void;
  onSave: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = React.memo(
  ({ questions, onQuestionsUpdate, onSave }) => {
    const handleQuestionUpdate = useCallback(
      (index: number, updatedQuestion: Question) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = updatedQuestion;
        onQuestionsUpdate(updatedQuestions);
      },
      [questions, onQuestionsUpdate],
    );

    const handleQuestionDelete = useCallback(
      (index: number) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        onQuestionsUpdate(updatedQuestions);
      },
      [questions, onQuestionsUpdate],
    );

    const handleAddQuestion = useCallback(() => {
      onQuestionsUpdate([
        ...questions,
        {
          question: "",
          choices: ["", "", "", ""],
          answer: "",
        },
      ]);
    }, [questions, onQuestionsUpdate]);

    return (
      <div>
        {questions.map((question, index) => (
          <QuestionEditor
            key={index}
            question={question}
            index={index}
            onUpdate={handleQuestionUpdate}
            onDelete={handleQuestionDelete}
          />
        ))}
        <button
          onClick={handleAddQuestion}
          className="flex items-center rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
        >
          <MdAdd className="mr-2" /> Add Question
        </button>
        <button
          onClick={onSave}
          className="mt-4 flex items-center rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
        >
          <MdCheck className="mr-2" /> Save
        </button>
      </div>
    );
  },
);

QuizEditor.displayName = "QuizEditor";
export default QuizEditor;
