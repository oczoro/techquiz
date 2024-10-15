import QuizCreator from "@/components/QuizCreator";
import Link from "next/link";

const getInitialData = async () => {
  let categories = [];
  let tags = [];

  try {
    const response = await fetch("https://quizapi.io/api/v1/categories", {
      method: "GET",
      headers: {
        "X-Api-Key": `${process.env.QUIZAPI_API_KEY}`,
      },
    });
    const data = await response.json();
    categories = data;
  } catch (error) {
    console.log("ERROR : ", error);
  }

  try {
    const response = await fetch("https://quizapi.io/api/v1/tags", {
      method: "GET",
      headers: {
        "X-Api-Key": `${process.env.QUIZAPI_API_KEY}`,
      },
    });
    const data = await response.json();
    tags = data;
  } catch (error) {
    console.log("ERROR : ", error);
  }

  categories.unshift({ id: 0, name: "Any" });

  return { categories, tags };
};

export default async function Home() {
  const { categories, tags } = await getInitialData();

  return (
    <div className="container flex flex-col items-center px-4 py-8">
      <h1 className="text-center text-3xl font-bold">
        <span className="text-gradient-brand">Quiz</span> Creator
      </h1>
      <p className="mt-4 text-center text-xl">
        Create a quiz of technical questions tailored to your liking using{" "}
        <Link
          href="https://quizapi.io/"
          className="text-gradient-brand font-bold"
        >
          QuizAPI.io!
        </Link>
      </p>
      <QuizCreator categories={categories} tags={tags} className="mt-16" />
    </div>
  );
}
