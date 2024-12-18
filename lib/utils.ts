import { QuizAPIQuestion } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanString(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function isMultipleChoice(data: QuizAPIQuestion) {
  const correct_answers = Object.values(data.correct_answers);
  return (
    correct_answers.length > 1 && correct_answers.sort().reverse()[1] === "true"
  );
}
