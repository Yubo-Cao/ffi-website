import { useEdit } from "@/components/Lesson/EditProvider";
import { QuizLesson, setLesson as updateLesson } from "@/lib/course";
import React, { useEffect, useState } from "react";
import { MdAdd, MdCheck, MdDelete } from "react-icons/md";

interface QuizComponentProps {
  lesson: QuizLesson;
  setLesson: (lesson: QuizLesson) => void;
}

export default function QuizComponent({
  lesson,
  setLesson,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [editedQuestions, setEditedQuestions] = useState(lesson?.questions);
  const { isEditing, setIsEditing } = useEdit();

  useEffect(() => {
    setEditedQuestions(lesson?.questions);
  }, [lesson]);

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answer });
  };

  const handleSubmitQuiz = () => {
    const feedback = lesson.questions.map((question, index) => {
      return {
        question: question.question,
        correct: quizAnswers[index] === question.answer,
        correctAnswer: question.answer,
        userAnswer: quizAnswers[index],
      };
    });
    setQuizFeedback(feedback);
  };

  if (!lesson) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    updateLesson({ ...lesson, questions: editedQuestions })
      .then(() => {
        setLesson({ ...lesson, questions: editedQuestions });
        setIsEditing(false);
      })
      .catch((e) => {
        console.error(e);
        alert("Failed to update quiz.");
      });
  };

  return (
    <div className="p-4">
      {isEditing ? (
        <div>
          {editedQuestions.map((question, index) => (
            <div key={index} className="relative mb-6">
              <div className="absolute right-0 top-0">
                <button
                  onClick={() => {
                    const updatedQuestions = [...editedQuestions];
                    updatedQuestions.splice(index, 1);
                    setEditedQuestions(updatedQuestions);
                  }}
                  className="text-red-600"
                >
                  <MdDelete size={20} />
                </button>
              </div>
              <label className="mb-2 block font-semibold">
                Question {index + 1}:
              </label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => {
                  const updatedQuestions = [...editedQuestions];
                  updatedQuestions[index].question = e.target.value;
                  setEditedQuestions(updatedQuestions);
                }}
                className="mb-4 w-full rounded-md border p-2"
              />
              <label className="mb-2 block font-semibold">Choices:</label>
              {question.choices.map((choice, choiceIndex) => (
                <input
                  key={choiceIndex}
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const updatedQuestions = [...editedQuestions];
                    updatedQuestions[index].choices[choiceIndex] =
                      e.target.value;
                    setEditedQuestions(updatedQuestions);
                  }}
                  className="mb-2 w-full rounded-md border p-2"
                />
              ))}
              <label className="mb-2 block font-semibold">Answer:</label>
              <input
                type="text"
                value={question.answer}
                onChange={(e) => {
                  const updatedQuestions = [...editedQuestions];
                  updatedQuestions[index].answer = e.target.value;
                  setEditedQuestions(updatedQuestions);
                }}
                className="mb-4 w-full rounded-md border p-2"
              />
            </div>
          ))}
          <button
            onClick={() =>
              setEditedQuestions([
                ...editedQuestions,
                {
                  question: "",
                  choices: ["", "", "", ""],
                  answer: "",
                },
              ])
            }
            className="flex items-center rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
          >
            <MdAdd className="mr-2" /> Add Question
          </button>
          <button
            onClick={handleSave}
            className="mt-4 flex items-center rounded-md bg-primary px-4 py-2 text-white transition hover:bg-opacity-80"
          >
            <MdCheck className="mr-2" /> Save
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-6 text-lg text-gray-800 dark:text-gray-300">
            {lesson.content}
          </p>
          {lesson.questions && lesson.questions.length > 0 && (
            <div className="quiz-container">
              <div className="mb-6 rounded-md border p-4">
                <p className="mb-4 text-lg font-semibold">
                  Question {currentQuestionIndex + 1} of{" "}
                  {lesson.questions.length}
                </p>
                <p className="mb-4 text-base">
                  {lesson.questions[currentQuestionIndex].question}
                </p>
                <ul className="space-y-3">
                  {lesson.questions[currentQuestionIndex].choices.map(
                    (choice, index) => (
                      <li key={index} className="flex items-center">
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={choice}
                          checked={quizAnswers[currentQuestionIndex] === choice}
                          onChange={() =>
                            handleQuizAnswer(currentQuestionIndex, choice)
                          }
                          className="mr-2"
                        />
                        <label className="text-gray-800 dark:text-gray-300">
                          {choice}
                        </label>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="mt-6 flex justify-between">
                {currentQuestionIndex > 0 && (
                  <button
                    className="rounded-md border border-primary px-4 py-2 text-primary transition"
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                  >
                    Previous
                  </button>
                )}
                {currentQuestionIndex < lesson.questions.length - 1 && (
                  <button
                    className="rounded-md border border-primary px-4 py-2 text-primary transition"
                    onClick={() =>
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    }
                  >
                    Next
                  </button>
                )}
                {currentQuestionIndex === lesson.questions.length - 1 && (
                  <button
                    className="rounded-md border border-primary px-4 py-2 text-primary transition"
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          )}
          {quizFeedback && (
            <div className="quiz-feedback mt-8 rounded-md border p-4">
              <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-300">
                Quiz Feedback
              </h3>
              <ul className="space-y-4">
                {quizFeedback.map((feedback, index) => (
                  <li key={index} className="text-gray-800 dark:text-gray-300">
                    <p className="font-semibold">
                      Question: {feedback.question}
                    </p>
                    <p>Your Answer: {feedback.userAnswer}</p>
                    <p>
                      {feedback.correct ? (
                        <span className="text-green-600">Correct!</span>
                      ) : (
                        <span className="text-red-600">
                          Incorrect. The correct answer is:{" "}
                          {feedback.correctAnswer}
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
