import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';
import { useLanguage } from '@/contexts/LanguageContext';
import { BaseExercise } from '@/types/exercises';

interface OppositeMeaningExercise {
  exerciseOrder: number;
  word: string;
  nativeMeaning: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface OppositeMeaningExerciseData extends BaseExercise {
  exercises: OppositeMeaningExercise[];
}

const SAMPLE_EXERCISE: OppositeMeaningExerciseData = {
  id: 'sample-opposite-meaning',
  words: ['groß', 'schnell', 'alt'],
  exercises: [
    {
      exerciseOrder: 1,
      word: 'groß',
      nativeMeaning: 'big/large',
      solution: 'klein',
      hint: 'Think about size',
      explanation: 'The opposite of groß (big) is klein (small).'
    },
    {
      exerciseOrder: 2,
      word: 'schnell',
      nativeMeaning: 'fast/quick',
      solution: 'langsam',
      hint: 'Think about speed',
      explanation: 'The opposite of schnell (fast) is langsam (slow).'
    },
    {
      exerciseOrder: 3,
      word: 'alt',
      nativeMeaning: 'old',
      solution: 'jung',
      hint: 'Think about age',
      explanation: 'The opposite of alt (old) is jung (young).'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date(),
  targetLanguage: 'de',
  nativeLanguage: 'en'
};

export const useOppositeMeaningExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<OppositeMeaningExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<OppositeMeaningExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Opposite meaning exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate opposite meaning exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          word: word.targetWord,
          nativeMeaning: word.nativeWord,
          solution: '', // Will be filled by AI
          hint: 'Think about the opposite concept',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: OppositeMeaningExerciseData = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.targetWord),
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date(),
          targetLanguage: languageSettings.targetLanguage.code,
          nativeLanguage: languageSettings.nativeLanguage.code
        };
        
        // Generate AI solutions for the vocabulary words
        generateAISolutions(categoryExercise, exerciseData.category);
        
        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    }
    
    // Load sample exercise if no vocabulary data
    loadSampleExercise();
  }, [languageSettings]);

  const generateAISolutions = async (exercise: OppositeMeaningExerciseData, category: string) => {
    try {
      const prompt = `Generate opposite meaning exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. The opposite word in ${languageSettings.targetLanguage.nativeName}
2. A helpful hint
3. A brief explanation

Words: ${exercise.words.join(', ')}
Category: ${category}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "word": "original_word",
      "opposite": "opposite_word",
      "hint": "helpful_hint",
      "explanation": "brief_explanation"
    }
  ]
}`;

      const response = await callOpenAI(prompt, 'You are a helpful language learning assistant.');
      const data = JSON.parse(response);
      
      if (data.exercises) {
        const updatedExercises = exercise.exercises.map((ex, index) => {
          const aiExercise = data.exercises.find((ai: any) => ai.word === ex.word);
          return {
            ...ex,
            solution: aiExercise?.opposite || ex.solution,
            hint: aiExercise?.hint || ex.hint,
            explanation: aiExercise?.explanation || ex.explanation
          };
        });
        
        const updatedExercise = {
          ...exercise,
          exercises: updatedExercises
        };
        
        setCurrentExercise(updatedExercise);
        setPreviousExercises(prev => [updatedExercise, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error generating AI solutions:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI solutions. Using sample data instead.",
        variant: "destructive",
      });
      setCurrentExercise(exercise);
      setPreviousExercises(prev => [exercise, ...prev.slice(0, 4)]);
    }
  };

  const loadSampleExercise = () => {
    const sampleExercise = {
      ...SAMPLE_EXERCISE,
      targetLanguage: languageSettings.targetLanguage.code,
      nativeLanguage: languageSettings.nativeLanguage.code
    };
    setCurrentExercise(sampleExercise);
    setPreviousExercises(prev => [sampleExercise, ...prev.slice(0, 4)]);
  };

  const generateExercise = async (input: string[] | any[]) => {
    try {
      const words = Array.isArray(input) ? input : [];
      
      if (words.length === 0) {
        toast({
          title: "Error",
          description: "Please provide at least one word.",
          variant: "destructive",
        });
        return;
      }

      const prompt = `Generate opposite meaning exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. The opposite word in ${languageSettings.targetLanguage.nativeName}
2. A helpful hint
3. A brief explanation

Words: ${words.join(', ')}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "word": "original_word",
      "opposite": "opposite_word",
      "hint": "helpful_hint",
      "explanation": "brief_explanation"
    }
  ]
}`;

      const response = await callOpenAI(prompt, 'You are a helpful language learning assistant.');
      const data = JSON.parse(response);
      
      if (data.exercises) {
        const exercises = data.exercises.map((ex: any, index: number) => ({
          exerciseOrder: index + 1,
          word: ex.word,
          nativeMeaning: '', // Will be filled by AI
          solution: ex.opposite,
          hint: ex.hint,
          explanation: ex.explanation
        }));
        
        const newExercise: OppositeMeaningExerciseData = {
          id: `opposite-meaning-${Date.now()}`,
          words,
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date(),
          targetLanguage: languageSettings.targetLanguage.code,
          nativeLanguage: languageSettings.nativeLanguage.code
        };
        
        setCurrentExercise(newExercise);
        setPreviousExercises(prev => [newExercise, ...prev.slice(0, 4)]);
        setUserAnswers({});
        setShowResults(false);
        
        toast({
          title: "Success",
          description: `Generated ${exercises.length} opposite meaning exercises.`,
        });
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
      toast({
        title: "Error",
        description: "Failed to generate exercise. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (exerciseOrder: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseOrder]: answer
    }));
  };

  const checkAnswers = () => {
    if (!currentExercise) return;
    
    const answeredCount = Object.keys(userAnswers).length;
    const totalCount = currentExercise.exercises.length;
    
    if (answeredCount < totalCount) {
      toast({
        title: "Incomplete",
        description: `Please answer all ${totalCount} questions before checking.`,
        variant: "destructive",
      });
      return;
    }
    
    setShowResults(true);
    
    const correctAnswers = currentExercise.exercises.filter(exercise => {
      const userAnswer = userAnswers[exercise.exerciseOrder];
      return userAnswer?.toLowerCase().trim() === exercise.solution.toLowerCase().trim();
    }).length;
    
    const percentage = Math.round((correctAnswers / totalCount) * 100);
    
    toast({
      title: "Results",
      description: `You got ${correctAnswers} out of ${totalCount} correct (${percentage}%).`,
    });
  };

  const resetExercise = () => {
    if (!currentExercise) return;
    
    setUserAnswers({});
    setShowResults(false);
  };

  const loadPreviousExercise = (exercise: OppositeMeaningExerciseData) => {
    setCurrentExercise(exercise);
    setUserAnswers({});
    setShowResults(false);
  };

  return {
    currentExercise,
    userAnswers,
    showResults,
    previousExercises,
    isLoading,
    generateExercise,
    handleAnswerChange,
    checkAnswers,
    resetExercise,
    loadPreviousExercise
  };
};