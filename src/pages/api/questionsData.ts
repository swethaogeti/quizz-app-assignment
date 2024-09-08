import type { NextApiRequest, NextApiResponse } from "next";
import questions from "../../../public/questions.json";
type Question = {
  question: string;
  options: { id: number; text: string }[];
  answer: number;
  id: string;
  image?: string
};

type Data = Question[];
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(questions);
}

// type Data = {
//   id: number;
//   question: string;
//   answer: string;
// };

// type State = {
//   data: Data[];
// };
