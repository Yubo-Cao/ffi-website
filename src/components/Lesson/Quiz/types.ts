interface QuizFeedback {
  question: string;
  correct: boolean;
  correctAnswer: string;
  userAnswer: string;
}

interface Question {
  question: string;
  choices: string[];
  answer: string;
}

interface QuizLesson {
  content: string;
  questions: Question[];
}
