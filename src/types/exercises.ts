export interface BaseExercise {
  id: string;
  words: string[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
}

export interface TranslationSentence {
  sentenceOrder: number;
  germanSentence: string;
  englishSentence: string;
}

export interface TranslationExercise extends BaseExercise {
  sentences: TranslationSentence[];
}

export interface MultipleChoiceSentence {
  sentenceOrder: number;
  sentence: string;
  options: string[];
  solution: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  sentences: MultipleChoiceSentence[];
}

export interface MatchingPair {
  pairOrder: number;
  germanWord: string;
  englishWord: string;
}

export interface MatchingExercise extends BaseExercise {
  pairs: MatchingPair[];
  userMatches: { [key: number]: number };
}
