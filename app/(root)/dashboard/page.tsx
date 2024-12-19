import QuizCreateButton from "@/components/Quiz/QuizCreateButton";
import QuizTable from "@/components/Quiz/QuizTable";
import { currentUser } from "@clerk/nextjs/server";
const emojis = [
  "🎉",
  "🌟",
  "🍕",
  "👋",
  "😊",
  "🌞",
  "🤗",
  "🎉",
  "🙌",
  "🌼",
  "🎈",
  "✨",
  "🥳",
];

const Dashboard = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { search, category, difficulty, tags, sort } = await searchParams;
  const clerkUser = await currentUser();
  if (!clerkUser)
    return (
      <section>
        <p>Not signed in</p>
      </section>
    );

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <section className="container mb-16 flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-2xl">
          <span>Hi, {clerkUser ? clerkUser.firstName : "Welcome"}!</span>
          <span className="animate-bounce text-lg">{emoji}</span>
        </p>
        <QuizCreateButton />
      </div>
      <QuizTable
        clerkUserId={clerkUser.id}
        searchParam={search}
        categoryParam={category}
        difficultyParam={difficulty}
        tagsParam={tags}
        sortParam={sort}
      />
    </section>
  );
};

export default Dashboard;
