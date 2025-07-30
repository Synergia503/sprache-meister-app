import { CustomWord } from '@/types/vocabulary';

interface VocabularyWord {
  id: string;
  targetWord: string;
  nativeWord: string;
  categories: string[];
}

interface ExerciseData {
  words: VocabularyWord[];
  category: string;
  exerciseType: string;
}

class VocabularyExerciseService {
  private static instance: VocabularyExerciseService;
  private currentExerciseData: ExerciseData | null = null;

  private constructor() {}

  static getInstance(): VocabularyExerciseService {
    if (!VocabularyExerciseService.instance) {
      VocabularyExerciseService.instance = new VocabularyExerciseService();
    }
    return VocabularyExerciseService.instance;
  }

  setExerciseData(words: CustomWord[], category: string, exerciseType: string): void {
    this.currentExerciseData = {
      words: words.map(word => ({
        id: word.id,
        targetWord: word.targetWord,
        nativeWord: word.nativeWord,
        categories: word.categories
      })),
      category,
      exerciseType
    };
    console.log('🔥 VocabularyExerciseService: Set exercise data', {
      wordCount: words.length,
      category,
      exerciseType,
      words: words.map(w => w.targetWord)
    });
  }

  getExerciseData(): ExerciseData | null {
    console.log('🔥 VocabularyExerciseService: Get exercise data', this.currentExerciseData);
    return this.currentExerciseData;
  }

  clearExerciseData(): void {
    console.log('🔥 VocabularyExerciseService: Clearing exercise data');
    this.currentExerciseData = null;
  }

  hasExerciseData(): boolean {
    const hasData = this.currentExerciseData !== null;
    console.log('🔥 VocabularyExerciseService: Has exercise data?', hasData);
    return hasData;
  }

  getWordsForExercise(): VocabularyWord[] {
    return this.currentExerciseData?.words || [];
  }

  getTargetWords(): string[] {
    return this.currentExerciseData?.words.map(word => word.targetWord) || [];
  }

  getVocabularyPairs(): Array<{ targetWord: string; nativeWord: string }> {
    return this.currentExerciseData?.words.map(word => ({
      targetWord: word.targetWord,
      nativeWord: word.nativeWord
    })) || [];
  }

  getCategory(): string {
    return this.currentExerciseData?.category || '';
  }

  getExerciseType(): string {
    return this.currentExerciseData?.exerciseType || '';
  }
}

export const vocabularyExerciseService = VocabularyExerciseService.getInstance();
export type { VocabularyWord, ExerciseData };