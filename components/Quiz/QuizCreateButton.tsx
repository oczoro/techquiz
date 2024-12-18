"use client";

import { useSessionStorage } from "@/hooks/useSessionStorage";
import { SavedQuizData } from "@/types";
import { useRouter } from "next/navigation";

const QuizCreateButton = () => {
  const router = useRouter();
  const { updateValue: setReviewData } =
    useSessionStorage<SavedQuizData | null>("reviewData", null);

  function onCreateQuiz() {
    setReviewData({
      meta: { name: "New Quiz", category: "Any", difficulty: "Any", tags: [] },
      questions: [],
    });
    router.push("/quiz/review");
  }
  return (
    <button onClick={onCreateQuiz} className="button button--primary text-sm">
      Create Quiz
    </button>
  );
};

export default QuizCreateButton;
