import QuizGenerator from "@/components/Quiz/QuizGenerator";
import Link from "next/link";

async function GenerateQuiz({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { category, difficulty, tags, limit } = await searchParams;

  return (
    <div className="container flex flex-col items-center px-4 py-8">
      <h1 className="text-center text-3xl font-bold">
        <span className="text-gradient-brand">Quiz</span> Generator
      </h1>
      <p className="mt-4 text-center text-xl">
        Generate a quiz of technical questions tailored to your liking using{" "}
        <Link
          href="https://quizapi.io/"
          className="text-gradient-brand font-bold"
        >
          QuizAPI.io!
        </Link>
      </p>
      <QuizGenerator
        categoryParam={category}
        difficultyParam={difficulty}
        tagsParam={tags}
        limitParam={limit}
        className="my-16 max-w-3xl"
      />
    </div>
  );
}

export default GenerateQuiz;
