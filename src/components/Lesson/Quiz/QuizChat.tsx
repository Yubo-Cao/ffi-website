import { BaseChat } from "../Chat/BaseChat";
import { ForwardedRef, forwardRef } from "react";
import { MdClose, MdPushPin } from "react-icons/md";

interface QuizFeedback {
  question: string;
  correct: boolean;
  correctAnswer: string;
  userAnswer: string;
}

interface QuizHelpChatProps {
  feedback: QuizFeedback;
  onClose: () => void;
  position: { top: number; left: number };
  pinned: boolean;
  setPinned: (pinned: (pinned: boolean) => boolean) => void;
}

export const QuizHelpChat = forwardRef(
  (
    { feedback, onClose, position, pinned, setPinned }: QuizHelpChatProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const context = `Question: ${feedback.question}\nCorrect Answer: ${feedback.correctAnswer}\nUser's Answer: ${feedback.userAnswer}`;
    const initialMessage = `I see you had trouble with this question. How can I help you understand why "${feedback.correctAnswer}" is the correct answer?`;

    return (
      <div
        className="fixed bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-[102] w-80 h-96 flex flex-col"
        style={{ top: position.top, left: position.left }}
        onMouseLeave={() => !pinned && onClose()}
        ref={ref}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Question Help</h3>
          <div className="flex gap-2 items-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <MdClose size={20} />
            </button>
            <button
              onClick={() => setPinned((pinned) => !pinned)}
              className={`text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${
                pinned ? "text-primary" : ""
              }`}
            >
              <MdPushPin
                size={20}
                className={`transforms transition-transform ${pinned && "rotate-45"}`}
              />
            </button>
          </div>
        </div>

        <BaseChat
          context={context}
          initialMessage={initialMessage}
          className="flex-1"
        />
      </div>
    );
  },
);
QuizHelpChat.displayName = "QuizHelpChat";
