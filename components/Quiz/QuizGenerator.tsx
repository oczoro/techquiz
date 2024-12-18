"use client";

import { cn } from "@/lib/utils";
import { Button } from "@headlessui/react";

import { useRouter } from "next/navigation";
import { Category, Difficulties, SavedQuizData, Tag } from "@/types";
import {
  CategoryCombobox,
  DifficultyRadioGroup,
  LimitInput,
  TagCombobox,
} from "../Fields";
import { useDataFetching } from "@/hooks/useDataFetching";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { useState } from "react";
import toast from "react-hot-toast";

type QuizGeneratorProps = {
  categoryParam?: string;
  difficultyParam?: string;
  tagsParam?: string;
  limitParam?: string;
  className?: string;
};

const QuizGenerator = ({
  categoryParam,
  difficultyParam,
  tagsParam,
  limitParam,
  className,
}: QuizGeneratorProps) => {
  const router = useRouter();
  const { data: categorylist } = useDataFetching<Category[]>("/api/categories");
  const { data: tagList } = useDataFetching<Tag[]>("/api/tags");
  const { updateValue: setReviewData } =
    useSessionStorage<SavedQuizData | null>("reviewData", null);

  const [selectedCategory, setSelectedCategory] = useState({
    id: 0,
    name: "Any",
  });
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulties>("Any");
  const [selectedLimit, setSelectedLimit] = useState(1);
  const parsedTags = tagsParam
    ? tagsParam.split(",").map((tag) => ({ name: tag }))
    : [];
  const [selectedTags, setSelectedTags] = useState<Tag[]>(parsedTags);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("difficulty") === "Any") {
      formData.delete("difficulty");
    } else {
      formData.set("difficulty", selectedDifficulty);
    }

    if (selectedCategory.name !== "Any")
      formData.append("category", selectedCategory.name);

    const formattedTags = selectedTags.map((tag: Tag) => tag.name).join(",");
    if (selectedTags.length > 0) formData.append("tags", formattedTags);

    formData.set("limit", selectedLimit + "");

    const convertedFormData = Array.from(formData, ([key, value]) => [
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    ]);

    try {
      const params = new URLSearchParams(convertedFormData).toString();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/quiz-data?${params}`,
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (result.error) {
        toast.error(result.error);
      }

      setReviewData({
        meta: {
          name: "Generated Quiz",
          difficulty: selectedDifficulty,
          category: selectedCategory.name,
          tags: selectedTags,
        },
        questions: result.error ? [] : result,
      });

      router.push("/quiz/review");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "form-shadow flex w-full flex-col rounded-xl border-2 border-white p-8",
        className,
      )}
    >
      <div className="flex flex-wrap">
        <CategoryCombobox
          value={categoryParam}
          categories={categorylist || []}
          className={cn("basis-full", "md:basis-1/2 md:pr-4")}
          onChange={(category: Category) => {
            if (!category) return;
            setSelectedCategory(category);
          }}
        />
        <DifficultyRadioGroup
          value={difficultyParam as Difficulties}
          onChange={(difficulty) => setSelectedDifficulty(difficulty)}
          className={cn(
            "flex basis-full flex-col gap-1",
            "mt-4 md:mt-0 md:basis-1/2 md:pl-4",
          )}
        />
        <LimitInput
          label="Question Limit"
          minLimit={1}
          maxLimit={20}
          value={Number(limitParam) ?? 1}
          onChange={(limit) => setSelectedLimit(limit)}
          className={cn(
            "flex basis-full flex-col gap-1",
            "mt-4 sm:basis-auto sm:pr-4 md:mt-8",
          )}
        />
        <TagCombobox
          className={cn("grow", "mt-4 sm:pl-4 md:mt-8")}
          classNameTags="basis-full"
          tagList={tagList || []}
          tags={selectedTags || []}
          onChange={(tags) => setSelectedTags(tags)}
        />
      </div>
      <Button
        className="button button--primary mx-auto mt-8 self-center px-16 text-2xl active:brightness-90"
        type="submit"
      >
        Generate
      </Button>
    </form>
  );
};

export default QuizGenerator;
