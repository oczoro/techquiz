import QuizForm from "@/components/Quiz/QuizForm";
import QuizSaveDraft from "@/components/Quiz/QuizSaveDraft";
import { DataModel } from "@/convex/_generated/dataModel";

const Review = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { saved, quizId } = await searchParams;

  if (saved === "true") {
    return <QuizSaveDraft />;
  }

  return (
    <section className="w-full">
      <QuizForm quizId={quizId as DataModel["quizzes"]["document"]["_id"]} />
    </section>
  );
};

export default Review;
