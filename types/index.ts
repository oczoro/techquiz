export type Category = {
  id: number;
  name: string;
};

export type Tag = {
  name: string;
};

export type Difficulties = "Any" | "Easy" | "Medium" | "Hard";

export type QuizAPIQuestion = {
  id: number;
  question: string;
  description: string | null;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  multiple_correct_answers: "true" | "false";
  correct_answers: {
    answer_a_correct: "true" | "false";
    answer_b_correct: "true" | "false";
    answer_c_correct: "true" | "false";
    answer_d_correct: "true" | "false";
    answer_e_correct: "true" | "false";
    answer_f_correct: "true" | "false";
  };
  explanation: string | null;
  tip: string | null;
  tags: Tag[];
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type QuizQuestion = {
  id: number;
  question: string;
  answers: { id: string; answer: string }[];
  correct_answers: string[];
  explanation: string;
  tip: string | null;
  tags: Tag[];
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type Quiz = {
  id: number;
  questions: QuizQuestion[];
};

export type SavedQuizData = {
  meta: {
    name: string;
    category: string;
    difficulty: Difficulties;
    tags: Tag[];
  };
  questions: QuizAPIQuestion[];
};
