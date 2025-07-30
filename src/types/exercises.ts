export interface BaseExercise {
  id: string;
  words: string[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
  targetLanguage: string;
  nativeLanguage: string;
}

export interface TranslationSentence {
  sentenceOrder: number;
  targetSentence: string;
  nativeSentence: string;
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
  targetWord: string;
  nativeWord: string;
}

export interface MatchingExercise extends BaseExercise {
  pairs: MatchingPair[];
  userMatches: { [key: number]: number };
}
