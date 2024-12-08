export type Question = {
  id: number;
  text: string;
  weight: 1 | 2 | 3 | 4 | 5;
  answer: "yes" | "no" | "na" | null;
};
