"use client";
import { QuizAPIQuestion, SavedQuizData } from "@/types";
import IonCheckmarkCircle from "~icons/ion/checkmark-circle.jsx";
import IonCloseCircle from "~icons/ion/close-circle.jsx";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const Progress = ({
  current_question,
  total_questions,
  answer_history,
  setCurrentQuestion,
}: {
  current_question: number;
  total_questions: number;
  answer_history: { id: number; correct: boolean }[];
  setCurrentQuestion: (num: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div>
        <span className="text-gradient-brand">{current_question}</span> /{" "}
        {total_questions}
      </div>
      <div className="flex w-full flex-wrap justify-center gap-4">
        {Array.from({ length: total_questions }, (_, i) => i + 1).map((num) => (
          <div
            onClick={() => current_question !== num && setCurrentQuestion(num)}
            key={num}
            className={cn(
              "duration-400 h-4 w-4 cursor-pointer rounded-full bg-slate-300 transition ease-out hover:brightness-110",
              {
                "-translate-y-1 bg-gradient-to-tr from-[#1F92E4] to-[#1FE4C3]":
                  num === current_question,
                "bg-gradient-to-tr from-emerald-600 to-green-300":
                  answer_history.find((answer) => answer.id === num)
                    ?.correct === true,
                "bg-gradient-to-tr from-red-600 to-red-300":
                  answer_history.find((answer) => answer.id === num)
                    ?.correct === false,
              },
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

const Question = ({
  question_data,
  question_number,
  total_questions,
  className,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuestion,
}: {
  question_data: QuizAPIQuestion;
  question_number: number;
  total_questions: number;
  className?: string;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitQuestion: (id: number, correct: boolean) => void;
}) => {
  const [selectedUserAnswers, setUserAnswers] = useState<string[]>([]);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAnswerCorrect = (key: string) => {
    return (
      question_data.correct_answers[
        `${key}_correct` as keyof typeof question_data.correct_answers
      ] === "true"
    );
  };

  const handleSelectAnswer = (answer: string) => {
    // If question is multiple choice, append answer if it doesn't exist, or remove it if it does
    if (question_data.multiple_correct_answers === "true") {
      if (selectedUserAnswers.includes(answer)) {
        setUserAnswers(selectedUserAnswers.filter((a) => a !== answer));
      } else {
        setUserAnswers([...selectedUserAnswers, answer]);
      }
    }
    // If question is not multiple choice, set answer
    else {
      setUserAnswers([answer]);
    }
  };

  const handleSubmitQuestion = () => {
    if (selectedUserAnswers.length === 0) {
      setError("Please select an answer");
    } else {
      setError(null);
      setQuestionSubmitted(true);
      onSubmitQuestion(
        question_number,
        selectedUserAnswers.every(isAnswerCorrect),
      );
    }
  };

  return (
    <section
      className={cn(
        "form-shadow w-full rounded-xl border border-white p-8",
        className,
      )}
    >
      <p className="text-lg text-slate-400">
        Question {question_number}{" "}
        {question_data.multiple_correct_answers === "true"
          ? "(Multiple Choice)"
          : ""}
      </p>
      <div className="text-gradient-brand pb-2 text-xs font-medium">
        {question_data.tags.map((tag) => tag.name).join(", ")}
      </div>
      <h2 className="text-lg leading-tight md:text-xl">
        {question_data.question}
      </h2>
      <div className="mt-6 flex flex-col gap-2">
        {Object.entries(question_data.answers).map(
          ([key, value]) =>
            value !== null && (
              <button
                disabled={questionSubmitted}
                onClick={() => handleSelectAnswer(key)}
                className={cn(
                  "input-shadow flex cursor-pointer items-center gap-2 rounded-md border border-white p-2 transition duration-200 ease-out hover:-translate-y-1 hover:brightness-110",
                  {
                    "bg-gradient-to-r from-[#1F92E4] to-[#1FE4C3] text-white":
                      selectedUserAnswers.includes(key),
                    "bg-gradient-to-r from-red-500 to-orange-600 text-white":
                      questionSubmitted &&
                      selectedUserAnswers.includes(key) &&
                      !isAnswerCorrect(key),
                    "bg-gradient-to-r from-green-500 to-emerald-500 text-white":
                      questionSubmitted && isAnswerCorrect(key),
                  },
                )}
                key={key}
              >
                <div>
                  {questionSubmitted &&
                    selectedUserAnswers.includes(key) &&
                    (isAnswerCorrect(key) ? (
                      <IonCheckmarkCircle />
                    ) : (
                      <IonCloseCircle />
                    ))}
                </div>
                {value}
              </button>
            ),
        )}
      </div>
      {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      <div className={cn("mt-6 flex justify-between gap-4", { "mt-4": error })}>
        <button
          disabled={question_number === 1}
          onClick={onPreviousQuestion}
          className="button w-24 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={questionSubmitted}
          onClick={handleSubmitQuestion}
          className="button button--primary w-36 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          {questionSubmitted ? "Answered" : "Answer"}
        </button>
        <button
          disabled={question_number === total_questions}
          onClick={onNextQuestion}
          className="button w-24 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </section>
  );
};

const Quiz = ({
  quizId,
  className,
}: {
  quizId: string;
  className?: string;
}) => {
  const { value: reviewData } = useSessionStorage<SavedQuizData>("reviewData", {
    meta: {
      name: "New Quiz",
      category: "Any",
      difficulty: "Any",
      tags: [],
    },
    questions: [],
  });
  const [data, setData] = useState<QuizAPIQuestion[]>(reviewData.questions);

  useEffect(() => {
    setData(reviewData.questions);
  }, [reviewData]);

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answerHistory, setAnswerHistory] = useState<
    { id: number; correct: boolean }[]
  >([]);

  const calculateScore = () => {
    return (
      answerHistory.filter((answer) => answer.correct).length / data.length
    );
  };

  const Score = () => {
    const score = Math.round(calculateScore() * 100);
    let score_color;
    if (score >= 90) score_color = "text-green-500";
    else if (score >= 85) score_color = "text-lime-500";
    else if (score >= 80) score_color = "text-yellow-500";
    else if (score >= 75) score_color = "text-amber-500";
    else if (score >= 70) score_color = "text-orange-500";
    else score_color = "text-red-500";
    return (
      <div className={cn("text-4xl font-bold", score_color)}>{score}%</div>
    );
  };

  const handleNextQuestion = () => {
    if (currentQuestion === data.length) return;
    setCurrentQuestion(currentQuestion + 1);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion === 1) return;
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmitQuestion = (id: number, correct: boolean) => {
    setAnswerHistory([...answerHistory, { id, correct }]);
  };

  const retakeQuiz = () => {
    setAnswerHistory([]);
    setCurrentQuestion(1);
    setData(reviewData.questions);
  };

  return (
    <div className={cn("", className)}>
      <Progress
        current_question={currentQuestion}
        total_questions={data.length}
        answer_history={answerHistory}
        setCurrentQuestion={setCurrentQuestion}
      />
      <div>
        {data.map((question, index) => (
          <Question
            className={cn("mt-8 hidden", {
              block: currentQuestion === index + 1,
            })}
            key={question.id}
            question_data={question}
            question_number={index + 1}
            total_questions={data.length}
            onSubmitQuestion={handleSubmitQuestion}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
          />
        ))}

        <div className="mx-auto my-8 flex max-w-xs flex-col gap-4">
          {data.length !== 0 && answerHistory.length === data.length && (
            <>
              <div className="flex items-center justify-center gap-2">
                <p className="text-lg text-slate-400">You scored</p>
                <Score />
              </div>
              <button
                onClick={retakeQuiz}
                className="button button--primary text-center"
              >
                Retake
              </button>
              <Link
                href={`/quiz/review${quizId ? `&${quizId}` : ""}`}
                className="button bg-background-light text-center"
              >
                Edit Quiz
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
