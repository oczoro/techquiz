"use client";
import { ReactNode } from "react";
import ConvexClerkProvider from "./ConvexClerkProvider";

// export type QuizType = {
//   meta?: {
//     name?: string;
//     difficulty?: string;
//     category?: string;
//     tags?: Tag[];
//   };
//   data: QuizAPIQuestion[];
// };
// interface QuizContextType {
//   quizData: QuizType;
//   setQuizData: Dispatch<SetStateAction<QuizType>>;
// }
// export const QuizContext = createContext<QuizContextType>(
//   undefined as unknown as QuizContextType,
// );

const Providers = ({ children }: { children: ReactNode }) => {
  // const [quizData, setQuizData] = useState<QuizType>({
  //   meta: undefined,
  //   data: [],
  // });

  return <ConvexClerkProvider>{children}</ConvexClerkProvider>;
};

export default Providers;
