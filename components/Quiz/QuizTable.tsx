"use client";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Fieldset,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import IonSearch from "~icons/ion/search.jsx";
import IonChevronDown from "~icons/ion/chevron-down.jsx";
import IonFilter from "~icons/ion/filter.jsx";
import IonClose from "~icons/ion/close.jsx";
import IonTrash from "~icons/ion/trash.jsx";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/useDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Category, Difficulties, SavedQuizData, Tag } from "@/types";
import { DataModel } from "../../convex/_generated/dataModel";
import { CategoryCombobox, DifficultyRadioGroup, TagCombobox } from "../Fields";
import { useDataFetching } from "@/hooks/useDataFetching";
import Loader from "../Loader";
import { useSessionStorage } from "@/hooks/useSessionStorage";

function Sort({ sort, className }: { sort?: string; className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSort, setSelectedSort] = useState(sort ?? "az");

  function handleChange(value: string) {
    setSelectedSort(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "az") params.delete("sort");
    else params.set("sort", value);
    router.push(`/dashboard?${params.toString()}`);
  }

  function getSortingIcon(value: string) {
    switch (value) {
      case "az":
        return "A-Z";
      case "za":
        return "Z-A";
      case "asc":
        return "Recent";
      case "desc":
        return "Oldest";
    }
  }

  return (
    <Menu>
      <MenuButton
        className={cn(
          "input input-shadow relative flex items-center justify-evenly bg-background-light pr-8",
          className,
        )}
      >
        <span className="mr-2 text-slate-400">Sort By</span>
        <span>{getSortingIcon(selectedSort)}</span>
        <IonChevronDown className="absolute right-2 top-1/2 size-5 -translate-y-1/2 text-slate-300" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="form-shadow min-w-36 rounded-md border border-white bg-background-light p-4 text-slate-400 [--anchor-gap:.5rem]"
      >
        <MenuItem>
          <button
            onClick={() => handleChange("az")}
            className={cn("flex items-center gap-1", {
              "text-slate-500": selectedSort === "az",
            })}
          >
            A to Z
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => handleChange("za")}
            className={cn("flex items-center gap-1", {
              "text-slate-500": selectedSort === "za",
            })}
          >
            Z to A
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => handleChange("asc")}
            className={cn("flex items-center gap-1", {
              "text-slate-500": selectedSort === "asc",
            })}
          >
            Recent
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={() => handleChange("desc")}
            className={cn("flex items-center gap-1", {
              "text-slate-500": selectedSort === "desc",
            })}
          >
            Oldest
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

function Filter({
  category,
  difficulty,
  tags,
  className,
}: {
  category: string | undefined;
  difficulty: string | undefined;
  tags: string | undefined;
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useDataFetching<Category[]>("/api/categories");
  const { data: tagList } = useDataFetching<Tag[]>("/api/tags");

  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 0,
    name: "Any",
  });
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    difficulty ?? "Any",
  );
  const parsedTags = tags ? tags.split(",").map((tag) => ({ name: tag })) : [];
  const [selectedTags, setSelectedTags] = useState<Tag[]>(parsedTags);

  function handleSave() {
    const query = new URLSearchParams(searchParams);
    if (selectedCategory) {
      if (selectedCategory.name === "Any") query.delete("category");
      else query.set("category", selectedCategory.name);
    }
    if (selectedDifficulty) {
      if (selectedDifficulty === "Any") query.delete("difficulty");
      else query.set("difficulty", selectedDifficulty);
    }

    if (selectedTags.length > 0)
      query.set("tags", selectedTags.map((t) => t.name).join(","));
    else query.delete("tags");

    router.push(`/dashboard?${query.toString()}`);
    setIsOpen(false);
  }

  function handleClear() {
    router.push("/dashboard");
    setIsOpen(false);
  }

  return (
    <div className={cn("pointer-events-none relative", className)}>
      <button
        onClick={() => setIsOpen(true)}
        className="input input-shadow pointer-events-auto bg-background-light pr-8"
      >
        Filter
      </button>
      <IonFilter className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-8">
          <DialogPanel className="relative flex h-fit w-full max-w-2xl flex-col rounded-3xl border border-white bg-background-light">
            <p className="p-8 text-center text-lg font-medium tracking-wider text-slate-400">
              Filter
            </p>
            <IonClose
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 cursor-pointer text-lg text-slate-500"
            />
            <Fieldset className="grid grid-cols-9 gap-4 px-8">
              <CategoryCombobox
                className="col-span-4"
                categories={categories || []}
                value={category}
                onChange={(category) => {
                  if (!category) return;
                  setSelectedCategory(category);
                }}
              />
              <DifficultyRadioGroup
                className="col-span-5"
                value={difficulty as Difficulties}
                onChange={(difficulty) => {
                  if (!difficulty) return;
                  setSelectedDifficulty(difficulty);
                }}
              />
              <TagCombobox
                className="col-span-full"
                classNameTags="col-span-full"
                tagList={tagList ?? []}
                tags={parsedTags}
                onChange={(tags) => setSelectedTags(tags)}
              />
            </Fieldset>
            <div className="flex items-center justify-center gap-4 p-8">
              <button
                className="button w-36 bg-background-light"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                className="button button--primary w-36"
                onClick={handleSave}
              >
                Apply
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

function QuizCard({
  id,
  meta,
  questions,
  created,
  className,
}: {
  id: DataModel["quizzes"]["document"]["_id"];
  meta: DataModel["quizzes"]["document"]["meta"];
  questions: DataModel["quizzes"]["document"]["questions"];
  created: string;
  className?: string;
}) {
  const router = useRouter();
  const deleteQuiz = useMutation(api.quizzes.deleteQuiz);
  const { updateValue: setReviewData } =
    useSessionStorage<SavedQuizData | null>("reviewData", null);

  function handleEdit() {
    setReviewData({
      meta: {
        name: meta.name,
        category: meta.category,
        difficulty: meta.difficulty,
        tags: meta.tags,
      },
      questions: questions,
    });
    router.push("/quiz/review?quizId=" + id);
  }

  function handleDelete() {
    deleteQuiz({ quizId: id });
  }
  return (
    <div
      className={cn(
        "input input-shadow col-span-5 grid h-fit grid-cols-subgrid items-center divide-x rounded-md bg-background-light px-0",
        className,
      )}
    >
      <div className="px-4">
        <p>{meta.name}</p>
        <p
          className={cn("text-sm leading-3 text-slate-400", {
            "text-green-500": meta.difficulty === "Easy",
            "text-yellow-500": meta.difficulty === "Medium",
            "text-red-500": meta.difficulty === "Hard",
          })}
        >
          {meta.difficulty}
        </p>
      </div>
      <div className="px-4 text-center">{meta.category ?? "Test"}</div>
      <div className="px-4 text-center">{questions.length} Questions</div>
      <div className="px-4 text-center">{created}</div>
      <div className="flex items-center text-right">
        <button onClick={handleEdit} className="pl-4">
          edit
        </button>
        <button
          onClick={handleDelete}
          className="px-2 py-0 text-sm text-red-500"
        >
          <IonTrash />
        </button>
      </div>
    </div>
  );
}

const QuizTable = ({
  clerkUserId,
  searchParam,
  categoryParam,
  difficultyParam,
  tagsParam,
  sortParam,
}: {
  clerkUserId: string;
  searchParam: string | undefined;
  categoryParam: string | undefined;
  difficultyParam: string | undefined;
  tagsParam: string | undefined;
  sortParam: string | undefined;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const quizDocuments = useQuery(api.quizzes.getAuthorQuizzesBySearch, {
    clerkUserId: clerkUserId,
    search: searchParam,
    category: categoryParam,
    difficulty: difficultyParam as Difficulties,
    tags: tagsParam?.split(",").map((tag) => ({ name: tag })),
    sort: sortParam ?? "az",
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch && debouncedSearch !== "") {
      params.set("search", debouncedSearch);
    } else if (debouncedSearch === "") {
      params.delete("search");
    }
    router.push(`/dashboard?${params.toString()}`);
  }, [router, pathname, searchParams, debouncedSearch]);

  return (
    <>
      <Fieldset className="mt-4 flex justify-between gap-4">
        <div className="relative flex-grow focus-within:text-sky-400">
          <IonSearch className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 transition duration-200 ease-in" />
          <Input
            className="input input-shadow w-full bg-background-light pl-8"
            placeholder="Search Quizzes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onLoad={() => setSearch("")}
          />
        </div>
        <Filter
          category={categoryParam}
          difficulty={difficultyParam}
          tags={tagsParam}
        />
        <Sort sort={sortParam} />
      </Fieldset>
      <div className="input input-shadow--inner isolate mt-4 min-h-[50vh] gap-0 overflow-x-auto rounded-md bg-sky-800/5 p-0">
        <div className="h-full w-full min-w-max">
          <div className="grid grid-cols-[minmax(14rem,1fr)_auto_auto_auto_auto] gap-y-1 text-nowrap px-1">
            <div className="relative z-0 col-span-5 grid translate-y-2 grid-cols-subgrid rounded-t-md bg-slate-400/80 py-2 text-xs text-white">
              <div className="px-4">Name</div>
              <div className="px-4 text-center">Category</div>
              <div className="px-4 text-center">Questions</div>
              <div className="px-4 text-center">Created</div>
              <div className="px-4"></div>
            </div>
            {quizDocuments ? (
              quizDocuments.map((doc, index) => (
                <QuizCard
                  className="relative z-10"
                  created={new Date(doc._creationTime).toLocaleDateString()}
                  id={doc._id}
                  meta={doc.meta}
                  questions={doc.questions}
                  key={index}
                />
              ))
            ) : (
              <Loader className="p-8" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizTable;
