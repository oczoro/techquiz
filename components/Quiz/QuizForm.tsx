"use client";

import {
  CategoryCombobox,
  DifficultyRadioGroup,
  TagCombobox,
} from "@/components/Fields";
import { useDataFetching } from "@/hooks/useDataFetching";
import {
  Category,
  Difficulties,
  QuizAPIQuestion,
  SavedQuizData,
  Tag,
} from "@/types";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Label,
  Legend,
  Switch,
  Textarea,
} from "@headlessui/react";
import InfoIcon from "../InfoIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";

import IonCheckmark from "~icons/ion/checkmark.jsx";
import IonClose from "~icons/ion/close.jsx";
import IonTrash from "~icons/ion/trash.jsx";
import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useSignIn } from "@clerk/nextjs";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { DataModel } from "@/convex/_generated/dataModel";
import { useState } from "react";

const Questions = ({
  data,
  categorylist,
  taglist,
  onUpdate,
  onDelete,
  className,
}: {
  data: QuizAPIQuestion[];
  categorylist: Category[];
  taglist: Tag[];
  onUpdate: (id: number, data: QuizAPIQuestion) => void;
  onDelete: (id: number) => void;
  className?: string;
}) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {data.length > 0 ? (
        data.map((question, index) => (
          <Question
            index={index}
            key={question.id}
            data={question}
            editing={question.id === currentQuestionId}
            onEdit={(id) => setCurrentQuestionId(id)}
            onSave={(data) => onUpdate(question.id, data)}
            onDelete={(id) => onDelete(id)}
            categorylist={categorylist || []}
            taglist={taglist || []}
          />
        ))
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-center text-lg font-medium tracking-wider text-slate-400">
            No questions added yet
          </p>
        </div>
      )}
    </div>
  );
};

const Question = ({
  data,
  index,
  editing,
  onEdit,
  onSave,
  onDelete,
  categorylist,
  taglist,
  className,
}: {
  data: QuizAPIQuestion;
  index: number;
  editing: boolean;
  onEdit: (id: number | null) => void;
  onSave: (data: QuizAPIQuestion) => void;
  onDelete: (id: number) => void;
  categorylist: Category[];
  taglist: Tag[];
  className?: string;
}) => {
  const [question, setQuestion] = useState(data.question ?? "New Question");
  const [description, setDescription] = useState(data.description ?? "");
  const answersToArray = Object.entries(data.answers).map(([key, value]) => {
    const correct =
      data.correct_answers[
        `${key}_correct` as keyof typeof data.correct_answers
      ] === "true";
    return {
      key: key,
      value: value,
      correct: correct,
    };
  });
  const [answers, setAnswers] = useState(answersToArray ?? []);
  const [explanation, setExplanation] = useState(data.explanation ?? "");
  const [tip, setTip] = useState(data.tip ?? "");
  const [category] = useState(data.category ?? { id: 0, name: "Any" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "Any",
  });
  const [difficulty, setSelectedDifficulty] = useState(
    (data.difficulty as Difficulties) ?? "Any",
  );
  const [tags, setSelectedTags] = useState(data.tags ?? []);

  function handleEditAnswer(key: string, value: string) {
    setAnswers(
      answers.map((answer) => {
        if (answer.key === key) {
          return {
            ...answer,
            value: value,
          };
        }
        return answer;
      }),
    );
  }
  function handleToggleAnswer(key: string, correct: boolean) {
    setAnswers(
      answers.map((answer) => {
        if (answer.key === key) {
          return {
            ...answer,
            correct: correct,
          };
        }
        return answer;
      }),
    );
  }

  return (
    <div className={cn("grid grid-cols-8 gap-4", className)}>
      <Field className="col-span-full">
        <div className="input input-shadow relative flex w-full items-center justify-between gap-2 p-0">
          <span className="absolute -left-8 min-w-[3ch] text-right text-sm font-light text-slate-400">
            {index + 1}.
          </span>
          <Input
            name="question"
            className="w-full truncate bg-transparent py-2 pl-4"
            disabled={!editing}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {editing ? (
            <div className="mr-2 flex items-center gap-2">
              <button
                onClick={() => onEdit(null)}
                className="button w-[4rem] bg-background-light px-0 py-0 text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSave(data);
                  onEdit(null);
                }}
                className="button button--primary w-[4rem] py-0 text-sm"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="mr-2 flex items-center gap-2">
              <button
                onClick={() => onEdit(data.id)}
                className="button bg-background-light py-0 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(data.id)}
                className="py-0 text-sm text-red-500"
              >
                <IonTrash />
              </button>
            </div>
          )}
        </div>
      </Field>
      <div
        className={cn("relative col-span-full grid-cols-subgrid", {
          hidden: !editing,
          grid: editing,
        })}
      >
        <div className="absolute -left-4 -top-4 bottom-0 border-l border-l-slate-300"></div>
        <Field className="col-span-full">
          <Label className="pl-4 text-sm font-light text-slate-400">
            Description
          </Label>
          <Textarea
            className="input input-shadow mt-1 block w-full"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field className="col-span-full mt-4">
          <Label className="flex justify-between px-4 text-sm font-light text-slate-400">
            <span>Answer</span>
            <span>Correct</span>
          </Label>
          <div>
            {answers.map((answer) => (
              <div
                className="input input-shadow mt-1 flex w-full items-center justify-between rounded px-1 py-0"
                key={answer.key}
              >
                <Input
                  className="w-full bg-background-light py-1 pl-2 outline-none"
                  value={answer.value || ""}
                  placeholder="Enter answer"
                  onChange={(e) => handleEditAnswer(answer.key, e.target.value)}
                />
                <Switch
                  checked={answer.correct}
                  onChange={() =>
                    answer.value &&
                    handleToggleAnswer(answer.key, !answer.correct)
                  }
                  className={cn(
                    "input-shadow--inner group mr-1 inline-flex h-6 items-center justify-between gap-1 rounded-full border border-white px-2 text-sm transition duration-100 aria-[checked=false]:bg-red-500/10 data-[checked]:bg-green-500/10",
                    {
                      "cursor-not-allowed brightness-105 saturate-0":
                        !answer.value,
                    },
                  )}
                >
                  <IonCheckmark className="text-green-500 opacity-0 transition duration-100 group-data-[checked]:opacity-100" />
                  <IonClose className="text-red-500 opacity-0 transition duration-100 group-aria-[checked=false]:opacity-100" />
                </Switch>
              </div>
            ))}
          </div>
        </Field>
        <Field className="col-span-full mt-4">
          <Label className="pl-4 text-sm font-light text-slate-400">
            Explanation
          </Label>
          <Textarea
            className="input input-shadow mt-1 block w-full"
            name="explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </Field>
        <Field className="col-span-full mt-4">
          <Label className="pl-4 text-sm font-light text-slate-400">Tip</Label>
          <Input
            className="input input-shadow mt-1 block w-full"
            name="tip"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
          />
        </Field>
        <CategoryCombobox
          className="col-span-4 mt-4"
          categories={categorylist || []}
          value={category}
          onChange={(category) => {
            if (!category) return;
            setSelectedCategory(category);
          }}
        />
        <DifficultyRadioGroup
          className="col-span-4 mt-4"
          value={difficulty as Difficulties}
          renderOptionAny={false}
          onChange={(difficulty) => {
            if (!difficulty) return;
            setSelectedDifficulty(difficulty);
          }}
        />
        <TagCombobox
          className="col-span-full mt-4"
          classNameTags="col-span-full mb-4"
          tagList={taglist ?? []}
          tags={tags}
          onChange={(tags) => setSelectedTags(tags)}
        />
      </div>
    </div>
  );
};

const QuizForm = ({
  quizId,
}: {
  quizId?: DataModel["quizzes"]["document"]["_id"];
}) => {
  const router = useRouter();
  const reviewID = Date.now();
  const createQuiz = useMutation(api.quizzes.createQuiz);
  const { data: categorylist } = useDataFetching<Category[]>("/api/categories");
  const { data: taglist } = useDataFetching<Tag[]>("/api/tags");
  const { value: reviewData, updateValue: setReviewData } =
    useSessionStorage<SavedQuizData>("reviewData", {
      meta: {
        name: "New Quiz",
        category: "Any",
        difficulty: "Any",
        tags: [],
      },
      questions: [],
    });

  function addQuestion() {
    const stringId = `${Math.floor(Math.random() * 10) * -1 + "".padEnd(1, "0")}${Date.now()}`;
    const questionId = Number(stringId);
    const newQuestion: QuizAPIQuestion = {
      id: questionId,
      question: "New Question",
      description: "",
      answers: {
        answer_a: "Answer",
        answer_b: null,
        answer_c: null,
        answer_d: null,
        answer_e: null,
        answer_f: null,
      },
      multiple_correct_answers: "false",
      correct_answers: {
        answer_a_correct: "true",
        answer_b_correct: "false",
        answer_c_correct: "false",
        answer_d_correct: "false",
        answer_e_correct: "false",
        answer_f_correct: "false",
      },
      explanation: "",
      tip: null,
      tags: [],
      category: "",
      difficulty: "Easy",
    };

    setReviewData({
      ...reviewData,
      questions: [...reviewData.questions, newQuestion],
    });
  }

  function updateQuestion(id: number, data: QuizAPIQuestion) {
    setReviewData({
      ...reviewData,
      questions: reviewData.questions.map((question) => {
        if (question.id === id) {
          return data;
        }
        return question;
      }),
    });
  }

  function removeQuestion(id: number) {
    setReviewData({
      ...reviewData,
      questions: reviewData.questions.filter((question) => question.id !== id),
    });
  }

  function goToGenerateQuiz() {
    const params = new URLSearchParams();

    if (reviewData.meta.category !== "Any")
      params.set("category", reviewData.meta.category);

    if (reviewData.meta.difficulty !== "Any")
      params.set("difficulty", reviewData.meta.difficulty);

    if (reviewData.meta.tags.length > 0)
      params.set(
        "tags",
        reviewData.meta.tags.map((tag: Tag) => tag.name).join(","),
      );

    router.push(`/quiz/generate?${params.toString()}`);
  }

  function goToTakeQuiz() {
    router.push("/quiz/take");
  }

  const { signIn } = useSignIn();
  async function saveQuiz() {
    try {
      const parsedTags = reviewData.meta.tags.map((tag) => ({
        name: tag.name,
      }));
      await createQuiz({
        quizId: quizId,
        meta: {
          ...reviewData.meta,
          tags: parsedTags,
        },
        questions: reviewData.questions,
      });
      toast.success("Quiz saved successfully");
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Error saving quiz");
    }
  }
  function handleSignIn() {
    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sign-in",
      redirectUrlComplete: "/quiz/review?saved=true",
    });
  }

  return (
    <div>
      <Fieldset className="container grid grid-cols-8 gap-x-4">
        <Legend className="col-span-full mb-8 flex items-center justify-between gap-4 text-xl text-slate-500">
          <Input
            className="grow border-b bg-transparent px-2 py-2"
            placeholder="Quiz Name"
            value={reviewData.meta.name}
            onChange={(e) =>
              setReviewData({
                ...reviewData,
                meta: { ...reviewData.meta, name: e.target.value },
              })
            }
          />
          <div className="flex items-center gap-2">
            <InfoIcon>
              <p className="max-w-[25ch] text-center">
                Generate quiz data using{" "}
                <Link
                  href="https://quizapi.io/"
                  target="_blank"
                  className="underline"
                >
                  QuizAPI.io
                </Link>
                .
              </p>
            </InfoIcon>
            <Button
              onClick={goToGenerateQuiz}
              className="button button--primary text-sm"
            >
              Generate Questions
            </Button>
          </div>
        </Legend>
        <CategoryCombobox
          key={`${reviewID}-meta-category`}
          className="col-span-4"
          categories={categorylist || []}
          value={reviewData.meta.category}
          onChange={(category) => {
            if (!category) return;
            setReviewData({
              ...reviewData,
              meta: { ...reviewData.meta, category: category.name },
            });
          }}
        />
        <DifficultyRadioGroup
          key={`${reviewID}-meta-difficulty`}
          className="col-span-4"
          value={reviewData.meta.difficulty as Difficulties}
          onChange={(difficulty) => {
            if (!difficulty) return;
            setReviewData({
              ...reviewData,
              meta: { ...reviewData.meta, difficulty: difficulty },
            });
          }}
        />{" "}
        <TagCombobox
          key={`${reviewID}-meta-tags`}
          className="col-span-full mt-4"
          classNameTags="col-span-full"
          tagList={taglist ?? []}
          tags={reviewData.meta.tags}
          onChange={(tags) =>
            setReviewData({
              ...reviewData,
              meta: { ...reviewData.meta, tags: tags },
            })
          }
        />
      </Fieldset>
      <Fieldset>
        <Legend className="container col-span-full flex items-center justify-between py-2 text-xl text-slate-500">
          <span className="font-bold">Questions</span>
          <div className="flex items-center gap-4">
            <Button
              onClick={addQuestion}
              className="button bg-background-light text-sm"
            >
              Add Question
            </Button>
          </div>
        </Legend>
        <Questions
          key={`${reviewID}-questions`}
          className="container max-h-[32rem] overflow-y-auto"
          data={reviewData.questions}
          categorylist={categorylist ?? []}
          taglist={taglist ?? []}
          onUpdate={(id, data) => updateQuestion(id, data)}
          onDelete={(id) => removeQuestion(id)}
        />
      </Fieldset>
      <div className="container flex justify-end gap-4">
        {reviewData.questions.length > 0 && (
          <button
            onClick={goToTakeQuiz}
            className="button w-48 bg-background-light"
          >
            Take Quiz!
          </button>
        )}
        <Authenticated>
          <button onClick={saveQuiz} className="button button--primary w-48">
            Save Quiz
          </button>
        </Authenticated>
        <Unauthenticated>
          <button
            onClick={handleSignIn}
            className="button button--primary w-48"
          >
            Save Quiz
          </button>
        </Unauthenticated>
      </div>
    </div>
  );
};

export default QuizForm;
