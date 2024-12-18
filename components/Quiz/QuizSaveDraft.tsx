"use client";

import { api } from "@/convex/_generated/api";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { SavedQuizData } from "@/types";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";

const QuizSaveDraft = () => {
  const router = useRouter();
  const createQuiz = useMutation(api.quizzes.createQuiz);
  const { value: reviewData, updateValue: setReviewData } =
    useSessionStorage<SavedQuizData | null>("reviewData", null);

  useEffect(() => {
    if (!reviewData) return;

    createQuiz(reviewData);
    setReviewData(null);
    toast.success("Quiz saved successfully");
    router.push("/dashboard");
  }, [reviewData]);

  return <Loader />;
};

export default QuizSaveDraft;
