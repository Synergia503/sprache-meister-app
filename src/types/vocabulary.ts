import { Language } from "./languages";

export interface ExerciseResult {
  exerciseType:
    | "translation"
    | "multiple-choice"
    | "matching"
    | "gap-fill"
    | "word-definition"
    | "word-formation"
    | "opposite-meaning"
    | "same-meaning";
  success: boolean;
  date: Date;
  timeSpent: number; // in seconds
}

export interface CustomWord {
  id: string;
  targetLanguage: Language; // The language being learned
  nativeLanguage: Language; // The user's native language
  targetWord: string; // Word in the target language
  nativeWord: string; // Translation in native language
  categories: string[];
  sampleSentence: string;
  dateAdded: Date;
  learningHistory: ExerciseResult[];
  isFavorite: boolean;
  lastLearningDate?: Date;
}

export interface ExtractedWord {
  targetWord: string;
  nativeWord: string;
  categories?: string[];
}

export type SortOption =
  | "dateAdded"
  | "targetWord"
  | "nativeWord"
  | "learningProgress"
  | "lastLearning";
export type SortOrder = "asc" | "desc";

export interface VocabularyFilters {
  category?: string;
  favorites?: boolean;
  hasLearningHistory?: boolean;
  searchTerm?: string;
  targetLanguage?: string;
  nativeLanguage?: string;
}

export interface LanguageSettings {
  targetLanguage: Language;
  nativeLanguage: Language;
}
