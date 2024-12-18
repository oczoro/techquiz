"use client";

import { cn } from "@/lib/utils";
import { Category, Difficulties, Tag } from "@/types";
import {
  Field,
  Combobox,
  Label,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  RadioGroup,
  Radio,
  Input,
} from "@headlessui/react";
import { useState } from "react";

import IonChevronDown from "~icons/ion/chevron-down.jsx";
import IonCheckmark from "~icons/ion/checkmark.jsx";

import { Tag as TagComponent } from "@/components/Tag";

export function CategoryCombobox({
  categories,
  className,
  value,
  onChange,
}: {
  categories: Category[];
  className?: string;
  value?: string | Category;
  onChange?: (value: Category) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    typeof value === "string" || value instanceof String
      ? (categories.find((c) => c.name === value) ?? { id: 0, name: "Any" })
      : !value
        ? { id: 0, name: "Any" }
        : value,
  );
  const [categoryQuery, setCategoryQuery] = useState("");

  const filteredCategories: Category[] =
    categoryQuery === ""
      ? categories
      : categories.filter((category: Category) => {
          return category.name
            .toLowerCase()
            .includes(categoryQuery.toLowerCase());
        });

  function handleSelectCategory(category: Category) {
    if (!category) return;
    setSelectedCategory(category);
    if (onChange) onChange(category);
  }

  return (
    <Field className={className}>
      <div className="relative flex flex-col gap-1">
        <Combobox
          value={selectedCategory}
          onChange={(category: Category) => handleSelectCategory(category)}
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
            {filteredCategories.map((category: Category) => (
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
  );
}

export function DifficultyRadioGroup({
  className,
  renderOptionAny = true,
  value,
  onChange,
}: {
  className?: string;
  renderOptionAny?: boolean;
  value?: Difficulties;
  onChange?: (value: Difficulties) => void;
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    value ?? (renderOptionAny ? "Any" : "Easy"),
  );
  const difficulties = renderOptionAny
    ? ["Any", "Easy", "Medium", "Hard"]
    : (["Easy", "Medium", "Hard"] as const);

  function handleOnChange(value: Difficulties) {
    setSelectedDifficulty(value);
    if (onChange) onChange(value);
  }

  return (
    <Field className={className}>
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
        onChange={(value: Difficulties) => handleOnChange(value)}
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
  );
}

export function LimitInput({
  label = "Question Limit",
  minLimit,
  maxLimit,
  value,
  onChange,
  className,
}: {
  label: string;
  minLimit: number;
  maxLimit: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}) {
  const [selectedLimit, setSelectedLimit] = useState(value || 1);
  return (
    <Field className={className}>
      <Label className="pl-4 text-sm font-light text-slate-400" htmlFor="limit">
        {label}
      </Label>
      <Input
        id="limit"
        name="limit"
        type="number"
        min={minLimit}
        max={maxLimit}
        value={selectedLimit}
        onChange={(e) => {
          setSelectedLimit(Number(e.target.value));
          if (onChange) onChange(Number(e.target.value));
        }}
        className="input input-shadow block w-full"
      />
    </Field>
  );
}

export function TagCombobox({
  tagList,
  tags,
  onChange,
  className,
  classNameTags,
}: {
  tagList: Tag[];
  tags?: Tag[];
  onChange?: (tags: Tag[]) => void;
  className?: string;
  classNameTags?: string;
}) {
  const [tagQuery, setTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags ?? []);
  const filteredTags: Tag[] =
    tagQuery === ""
      ? tagList
      : tagList.filter((tag: Tag) => {
          return tag.name.toLowerCase().includes(tagQuery.toLowerCase());
        });

  function handleOnChange(tag: Tag) {
    if (!tag) return;
    if (tags && tags.find(({ name }) => name === tag.name)) return;
    if (selectedTags.find(({ name }) => name === tag.name)) return;

    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);
    if (onChange) onChange(newTags);
  }

  return (
    <>
      <Field className={className}>
        <div className="relative flex flex-col gap-1">
          <Combobox
            onChange={(tag: Tag) => handleOnChange(tag)}
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
              {filteredTags.map((tag, index) => (
                <ComboboxOption
                  className="group flex cursor-pointer select-none items-center gap-2 border-y border-transparent px-4 py-1 hover:border-white hover:bg-white/40 data-[focus]:border-white data-[focus]:bg-white/40"
                  key={index}
                  value={tag}
                >
                  <div>{tag.name}</div>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </div>
      </Field>
      <div className={cn("mt-4 flex flex-wrap gap-x-2 gap-y-2", classNameTags)}>
        {selectedTags.map((tag, index) => (
          <TagComponent
            key={index}
            tag={tag}
            onRemove={(tag) => {
              const newTags = selectedTags.filter((t) => t.name !== tag.name);
              setSelectedTags(newTags);
              if (onChange) onChange(newTags);
            }}
          />
        ))}
      </div>
    </>
  );
}
