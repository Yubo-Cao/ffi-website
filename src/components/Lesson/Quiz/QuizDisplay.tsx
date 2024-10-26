import { QuizHelpChat } from "@/components/Lesson/Quiz/QuizChat";
import React, { useCallback, useEffect, useState } from "react";
import { MdChat } from "react-icons/md";

interface QuizDisplayProps {
  lesson: QuizLesson;
  currentQuestionIndex: number;
  quizAnswers: Record<number, string>;
  quizFeedback: QuizFeedback[] | null;
  onAnswerSelect: (questionIndex: number, answer: string) => void;
  onNavigate: (direction: "prev" | "next") => void;
  onSubmit: () => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = React.memo(
  ({
    lesson,
    currentQuestionIndex,
    quizAnswers,
    quizFeedback,
    onAnswerSelect,
    onNavigate,
    onSubmit,
  }) => {
    const [activePopup, setActivePopup] = useState<number | null>(null);
    const [popupPinned, setPopupPinned] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const quizChatRef = React.createRef<HTMLDivElement>();
    const [currentHovering, setCurrentHovering] = useState<number | null>(null);

    const handleQuestionHover = useCallback(
      (event: React.MouseEvent, index: number) => {
        if (popupPinned) {
          return;
        }
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let top = event.clientY + 10;
        let left = event.clientX + 10;
        if (top + 200 > windowHeight) {
          top = windowHeight - 200;
        }
        if (left + 500 > windowWidth) {
          left = windowWidth - 500;
        }
        setPopupPosition({
          top: top,
          left: left,
        });
        setActivePopup(index);
        setCurrentHovering(index);
      },
      [popupPinned, setActivePopup, setCurrentHovering, setPopupPosition],
    );

    const handleMouseMove = (event) => {
      if (popupPinned) {
        return;
      }
      if (activePopup === null) {
        return;
      }
      if (currentHovering !== null) {
        return;
      }
      if (
        quizChatRef.current &&
        !quizChatRef.current.contains(event.target as Node)
      ) {
        setActivePopup(null);
      }
    };

    const handleScroll = () => {
      if (popupPinned) {
        return;
      }
      setActivePopup(null);
    };

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [handleMouseMove, handleScroll]);

    const handleAnswerSelect = useCallback(
      (answer: string) => {
        onAnswerSelect(currentQuestionIndex, answer);
      },
      [currentQuestionIndex, onAnswerSelect],
    );

    return (
      <div>
        <p className="mb-6 text-lg text-gray-800 dark:text-gray-300">
          {lesson.content}
        </p>
        {lesson.questions && lesson.questions.length > 0 && (
          <div className="quiz-container">
            <div className="mb-6 rounded-md border p-4">
              <p className="mb-4 text-lg font-semibold">
                Question {currentQuestionIndex + 1} of {lesson.questions.length}
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
                        onChange={() => handleAnswerSelect(choice)}
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
                  onClick={() => onNavigate("prev")}
                >
                  Previous
                </button>
              )}
              {currentQuestionIndex < lesson.questions.length - 1 && (
                <button
                  className="rounded-md border border-primary px-4 py-2 text-primary transition"
                  onClick={() => onNavigate("next")}
                >
                  Next
                </button>
              )}
              {currentQuestionIndex === lesson.questions.length - 1 && (
                <button
                  className="rounded-md border border-primary px-4 py-2 text-primary transition"
                  onClick={onSubmit}
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
                <li
                  key={index}
                  className={`text-gray-800 dark:text-gray-300 p-4 rounded-lg relative
                  ${!feedback.correct ? "hover:bg-gray-50 dark:hover:bg-gray-750 cursor-help" : ""}`}
                  onMouseEnter={
                    !feedback.correct
                      ? (e) => handleQuestionHover(e, index)
                      : undefined
                  }
                  onMouseLeave={() => setCurrentHovering(null)}
                >
                  <p className="font-semibold">Question: {feedback.question}</p>
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
                  {!feedback.correct && (
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                      dark:hover:text-gray-200"
                      onClick={(e) => handleQuestionHover(e, index)}
                    >
                      <MdChat size={20} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {activePopup !== null && quizFeedback && (
          <QuizHelpChat
            feedback={{
              question: quizFeedback[activePopup].question,
              correct: quizFeedback[activePopup].correct,
              correctAnswer: quizFeedback[activePopup].correctAnswer,
              userAnswer: quizFeedback[activePopup].userAnswer,
            }}
            position={popupPosition}
            onClose={() => setActivePopup(null)}
            ref={quizChatRef}
            pinned={popupPinned}
            setPinned={setPopupPinned}
          />
        )}
      </div>
    );
  },
);

QuizDisplay.displayName = "QuizDisplay";

export default QuizDisplay;
