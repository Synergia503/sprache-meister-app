
export interface GapFillSentence {
  sentenceOrder: number;
  sentence: string;
  solution: string;
}

export interface GapFillExercise {
  id: string;
  words: string[];
  sentences: GapFillSentence[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
}
