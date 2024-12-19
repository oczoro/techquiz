"use client";

import { api } from "@/convex/_generated/api";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { SavedQuizData } from "@/types";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { useUser } from "@clerk/nextjs";

const QuizSaveDraft = () => {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const createQuiz = useMutation(api.quizzes.createQuiz);
  const getUser = useQuery(api.users.doesUserExist, { clerkId: user?.id });
  const { value: reviewData, updateValue: setReviewData } =
    useSessionStorage<SavedQuizData | null>("reviewData", null);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !reviewData) return;

    if (!getUser) return;

    const saveQuiz = async () => {
      try {
        await createQuiz(reviewData);
        setReviewData({
          meta: {
            name: "",
            category: "Any",
            difficulty: "Any",
            tags: [],
          },
          questions: [],
        });
        toast.success("Quiz saved successfully");
        router.push("/dashboard");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Failed to save quiz");
      }
    };

    saveQuiz();
  }, [isAuthenticated, isLoading, getUser]);

  return (
    <div className="container flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default QuizSaveDraft;
