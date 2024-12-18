import NewQuizQuestions from "@/components/NewQuizQuestions";

const SaveQuiz = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}) => {
  const isGenerated = (await searchParams).generated === "true";
  const cat_response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
  );
  const categories = await cat_response.json();
  const tag_response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tags`,
  );
  const tags = await tag_response.json();

  return (
    <section className="container">
      <h2>Quiz Questions</h2>
      <NewQuizQuestions
        categories={categories}
        tags={tags}
        isGenerated={isGenerated}
      />
    </section>
  );
};

export default SaveQuiz;
