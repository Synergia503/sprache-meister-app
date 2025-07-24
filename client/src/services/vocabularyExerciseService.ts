interface VocabularyWord {
  id: string;
  german: string;
  english: string;
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

  setExerciseData(words: VocabularyWord[], category: string, exerciseType: string): void {
    this.currentExerciseData = {
      words,
      category,
      exerciseType
    };
    console.log('🔥 VocabularyExerciseService: Set exercise data', {
      wordCount: words.length,
      category,
      exerciseType,
      words: words.map(w => w.german)
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

  getGermanWords(): string[] {
    return this.currentExerciseData?.words.map(word => word.german) || [];
  }

  getVocabularyPairs(): Array<{ german: string; english: string }> {
    return this.currentExerciseData?.words.map(word => ({
      german: word.german,
      english: word.english
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