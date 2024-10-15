"use client";

import { cn } from "@/lib/utils";
import {
  Button,
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Input,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import IonChevronDown from "~icons/ion/chevron-down.jsx";
import IonCheckmark from "~icons/ion/checkmark";
import IonClose from "~icons/ion/close";
import { useState } from "react";
import { Category as CategoryType, Tag as TagType } from "@/types";

const difficulties = ["Any", "Easy", "Medium", "Hard"];

const Tag = ({
  tag,
  onRemove,
}: {
  tag: { id: number; name: string };
  onRemove: (id: number) => void;
}) => {
  return (
    <div className="flex rounded-full bg-blue-100/50 px-2 py-1">
      <span className="text-sm text-cyan-700">{tag.name}</span>
      <IonClose
        onClick={() => onRemove(tag.id)}
        className="ml-2 cursor-pointer text-cyan-800 transition duration-100 ease-out hover:text-cyan-500"
      />
    </div>
  );
};

const QuizCreator = ({
  categories,
  tags,
  className,
}: {
  categories: CategoryType[];
  tags: TagType[];
  className?: string;
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [categoryQuery, setCategoryQuery] = useState("");

  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);

  const [selectedTag, setSelectedTag] = useState({
    id: -1,
    name: "Select tags",
  });
  const [tagQuery, setTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<typeof tags | []>([]);

  const filteredCategories =
    categoryQuery === ""
      ? categories
      : categories.filter((category) => {
          return category.name
            .toLowerCase()
            .includes(categoryQuery.toLowerCase());
        });

  const filteredTags =
    tagQuery === ""
      ? tags
      : tags.filter((tag) => {
          return tag.name.toLowerCase().includes(tagQuery.toLowerCase());
        });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "form-shadow flex w-full flex-col rounded-xl border-2 border-white p-8",
        className,
      )}
    >
      <div className="flex flex-wrap gap-y-8">
        <Field className={cn("basis-full", "md:basis-1/2 md:pr-4")}>
          <div className="relative flex flex-col gap-1">
            <Combobox
              value={selectedCategory}
              onChange={setSelectedCategory}
              onClose={() => setCategoryQuery("")}
            >
              <Label className="pl-4 text-sm font-light text-slate-400">
                Category
              </Label>
              <div className="input input-shadow relative p-0 focus-within:outline focus-within:outline-2 focus-within:outline-blue-600">
                <ComboboxInput
                  className="w-full bg-transparent px-4 py-2 outline-none"
                  aria-label="Category"
                  displayValue={(category: typeof selectedCategory) =>
                    category?.name
                  }
                  onChange={(event) => setCategoryQuery(event.target.value)}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-4">
                  <IonChevronDown className="size-4 text-slate-400 group-data-[hover]:text-slate-300" />
                </ComboboxButton>
              </div>
              <ComboboxOptions
                anchor={{
                  to: "bottom",
                  gap: "0.5rem",
                }}
                className={cn(
                  "input input-shadow bg-slate-100/30 p-0 backdrop-blur-xl empty:invisible",
                  "w-[var(--input-width)]",
                  "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
                )}
              >
                {filteredCategories.map((category) => (
                  <ComboboxOption
                    className="group flex cursor-pointer select-none items-center gap-2 border-y border-transparent px-2 py-1 hover:border-white hover:bg-white/40 data-[focus]:border-white data-[focus]:bg-white/40"
                    key={category.id}
                    value={category}
                  >
                    <IonCheckmark className="invisible size-5 font-bold text-sky-500/50 group-data-[selected]:visible" />
                    <div className="group-data-[selected]:text-gradient-brand">
                      {category.name}
                    </div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
          </div>
        </Field>

        <Field
          className={cn(
            "flex basis-full flex-col gap-1",
            "md:basis-1/2 md:pl-4",
          )}
        >
          <Label
            className="pl-6 text-sm font-light text-slate-400"
            htmlFor="difficulty"
          >
            Difficulty
          </Label>
          <RadioGroup
            name="difficulty"
            className="input input-shadow--inner flex justify-between rounded-full px-6"
            value={selectedDifficulty}
            onChange={setSelectedDifficulty}
          >
            {difficulties.map((difficulty) => (
              <Field key={difficulty} className="flex items-center gap-2">
                <Radio
                  className={cn(
                    "cursor-pointer transition duration-300",
                    "hover:aria-[checked=false]:brightness-150 hover:aria-[checked=false]:drop-shadow-sm",
                    {
                      "data-[checked]:text-any": difficulty === "Any",
                      "data-[checked]:text-easy": difficulty === "Easy",
                      "data-[checked]:text-medium": difficulty === "Medium",
                      "data-[checked]:text-hard": difficulty === "Hard",
                    },
                  )}
                  value={difficulty}
                >
                  {difficulty}
                </Radio>
              </Field>
            ))}
          </RadioGroup>
        </Field>

        <Field className={cn("flex flex-col gap-1", "md:pr-4")}>
          <Label
            className="pl-4 text-sm font-light text-slate-400"
            htmlFor="limit"
          >
            Question Limit
          </Label>
          <Input
            id="limit"
            type="number"
            defaultValue={20}
            min={1}
            max={20}
            className="input input-shadow"
          />
        </Field>

        <Field className={cn("grow", "md:pl-4")}>
          <div className="relative flex flex-col gap-1">
            <Combobox
              onChange={(tag) => {
                if (selectedTags.find(({ id }) => id === tag.id)) return;
                setSelectedTags((tags) => [...tags, tag]);
              }}
              onClose={() => setTagQuery("")}
            >
              <Label className="pl-4 text-sm font-light text-slate-400">
                Tags
              </Label>
              <div className="input input-shadow relative p-0 focus-within:outline focus-within:outline-2 focus-within:outline-blue-600">
                <ComboboxInput
                  className="w-full bg-transparent px-4 py-2 outline-none"
                  aria-label="Tags"
                  onChange={(event) => setTagQuery(event.target.value)}
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-4">
                  <IonChevronDown className="size-4 text-slate-400 group-data-[hover]:text-slate-300" />
                </ComboboxButton>
              </div>
              <ComboboxOptions
                anchor={{
                  to: "bottom",
                  gap: "0.5rem",
                }}
                className={cn(
                  "input input-shadow bg-slate-100/30 p-0 backdrop-blur-xl empty:invisible",
                  "w-[var(--input-width)]",
                  "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0",
                )}
              >
                {filteredTags.map((tag) => (
                  <ComboboxOption
                    className="group flex cursor-pointer select-none items-center gap-2 border-y border-transparent px-4 py-1 hover:border-white hover:bg-white/40 data-[focus]:border-white data-[focus]:bg-white/40"
                    key={tag.id}
                    value={tag}
                  >
                    <div>{tag.name}</div>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
          </div>
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {selectedTags.map((tag) => (
          <Tag
            key={tag.id}
            tag={tag}
            onRemove={(id) =>
              setSelectedTags((tags) => tags.filter((t) => t.id !== id))
            }
          />
        ))}
      </div>
      <Button
        className="button button--primary mx-auto mt-12 self-center px-16 text-2xl active:brightness-90"
        type="submit"
      >
        Create
      </Button>
    </form>
  );
};

export default QuizCreator;
