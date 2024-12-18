import Quiz from "@/components/Quiz";

const QuizPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { quizId } = await searchParams;

  return (
    <div className="container h-fit w-full">
      <Quiz key={quizId ?? `quiz-${Date.now()}`} quizId={quizId as string} />
    </div>
  );
};

export default QuizPage;
