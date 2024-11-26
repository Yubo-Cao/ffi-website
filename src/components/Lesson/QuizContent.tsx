"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuizLesson } from "@/lib/course";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface QuizContentProps {
  lesson: QuizLesson;
  onComplete: () => void;
}

export function QuizContent({ lesson, onComplete }: QuizContentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    new Array(lesson.questions.length).fill(""),
  );
  const [showResults, setShowResults] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const hasAnswered = answers[currentQuestionIndex] !== "";
  const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
      setIsSubmitted(true);
      onComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const calculateScore = () => {
    const correctAnswers = answers.filter(
      (answer, index) => answer === lesson.questions[index].answer,
    ).length;
    return {
      score: correctAnswers,
      total: lesson.questions.length,
      percentage: Math.round((correctAnswers / lesson.questions.length) * 100),
    };
  };

  if (showResults) {
    const { score, total, percentage } = calculateScore();

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>
            You scored {score} out of {total} questions correctly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Progress value={percentage} className="h-2" />
            <p className="text-sm text-center text-muted-foreground">
              {percentage}% Complete
            </p>
          </div>

          <div className="space-y-4">
            {lesson.questions.map((question, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50">
                <p className="font-medium">{question.question}</p>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    answers[index] === question.answer
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  Your answer: {answers[index]}
                  {answers[index] !== question.answer && (
                    <span className="block text-green-600 dark:text-green-400">
                      Correct answer: {question.answer}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} of {lesson.questions.length}
          </span>
        </div>
        <Progress
          value={(currentQuestionIndex / lesson.questions.length) * 100}
          className="h-2 mt-4"
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestionIndex]}
          className="space-y-3"
        >
          {currentQuestion.choices.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!hasAnswered}>
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
        </Button>
      </CardFooter>
    </Card>
  );
}
