export interface ExerciseResult {
  exerciseType: 'translation' | 'multiple-choice' | 'matching' | 'gap-fill';
  success: boolean;
  date: Date;
  timeSpent: number; // in seconds
}

export interface CustomWord {
  id: string;
  german: string;
  english: string;
  categories: string[];
  sampleSentence: string;
  dateAdded: Date;
  learningHistory: ExerciseResult[];
  isFavorite: boolean;
  lastLearningDate?: Date;
}

export interface ExtractedWord {
  german: string;
  english: string;
  categories?: string[];
}

export type SortOption = 'dateAdded' | 'german' | 'english' | 'learningProgress' | 'lastLearning';
export type SortOrder = 'asc' | 'desc';

export interface VocabularyFilters {
  category?: string;
  favorites?: boolean;
  hasLearningHistory?: boolean;
  searchTerm?: string;
}