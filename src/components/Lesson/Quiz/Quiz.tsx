import { useEdit } from "@/components/Lesson/EditProvider";
import QuizDisplay from "@/components/Lesson/Quiz/QuizDisplay";
import QuizEditor from "@/components/Lesson/Quiz/QuizEditor";
import { QuizLesson, setLesson as updateLesson } from "@/lib/course";
import React, { useCallback, useEffect, useState } from "react";

interface QuizProps {
  lesson: QuizLesson;
  setLesson: (lesson: QuizLesson) => void;
}

export default function Quiz({ lesson, setLesson }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<QuizFeedback[] | null>(null);
  const [editedQuestions, setEditedQuestions] = useState(lesson?.questions);
  const { isEditing, setIsEditing } = useEdit();

  useEffect(() => {
    setEditedQuestions(lesson?.questions);
  }, [lesson]);

  const handleQuizAnswer = useCallback(
    (questionIndex: number, answer: string) => {
      setQuizAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    },
    [],
  );

  const handleNavigate = useCallback((direction: "prev" | "next") => {
    setCurrentQuestionIndex((prev) =>
      direction === "prev" ? prev - 1 : prev + 1,
    );
  }, []);

  const handleSubmitQuiz = useCallback(() => {
    const feedback = lesson.questions.map((question, index) => ({
      question: question.question,
      correct: quizAnswers[index] === question.answer,
      correctAnswer: question.answer,
      userAnswer: quizAnswers[index],
    }));
    setQuizFeedback(feedback);
  }, [lesson.questions, quizAnswers]);

  const handleSave = useCallback(async () => {
    try {
      await updateLesson({ ...lesson, questions: editedQuestions });
      setLesson({ ...lesson, questions: editedQuestions });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update quiz.");
    }
  }, [lesson, editedQuestions, setLesson, setIsEditing]);

  return (
    <div className="p-4">
      {isEditing ? (
        <QuizEditor
          questions={editedQuestions}
          onQuestionsUpdate={setEditedQuestions}
          onSave={handleSave}
        />
      ) : (
        <QuizDisplay
          lesson={lesson}
          currentQuestionIndex={currentQuestionIndex}
          quizAnswers={quizAnswers}
          quizFeedback={quizFeedback}
          onAnswerSelect={handleQuizAnswer}
          onNavigate={handleNavigate}
          onSubmit={handleSubmitQuiz}
        />
      )}
    </div>
  );
}
