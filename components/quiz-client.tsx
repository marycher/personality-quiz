"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import ResultScreen from "@/components/result-screen";

interface Question {
  id: string;
  text: string;
  options: { text: string; isCorrect: boolean }[];
}

interface QuizClientProps {
  questions: Question[];
  name: string;
}

export default function QuizClient({ questions, name }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = useCallback(() => {
    if (selectedId === null) return;
    const isCorrect = currentQuestion.options[selectedId].isCorrect;
    setIsAnswered(true);
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selectedIndex: selectedId, isCorrect },
    ]);
  }, [selectedId, currentQuestion]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedId(null);
      setIsAnswered(false);
    }
  }, [isLast]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedId(null);
      setIsAnswered(false);
    }
  }, [currentIndex]);

  if (finished) {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / questions.length) * 100);
    return <ResultScreen percentage={percentage} name={name} answers={answers} />;
  }

  const getOptionClass = (index: number) => {
    if (!isAnswered) {
      return selectedId === index
        ? "border-purple-500 bg-purple-50 cursor-pointer"
        : "border-gray-200 hover:border-purple-300 cursor-pointer";
    }

    if (currentQuestion.options[index].isCorrect) {
      return "border-green-500 bg-green-50";
    }

    if (selectedId === index && !currentQuestion.options[index].isCorrect) {
      return "border-red-500 bg-red-50";
    }

    return "border-gray-200 opacity-60";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Вопрос {currentIndex + 1} из {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
        {currentQuestion.text}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <div
            key={index}
            onClick={() => !isAnswered && setSelectedId(index)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${getOptionClass(index)}`}
          >
            <span className="text-gray-800">{option.text}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="outline"
        >
          Назад
        </Button>

        <div className="flex gap-2">
          {!isAnswered ? (
            <Button
              onClick={handleAnswer}
              disabled={selectedId === null}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Ответить
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLast ? "Завершить" : "Далее"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
