import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';
import { BaseExercise } from '@/types/exercises';

interface SameMeaningExercise {
  exerciseOrder: number;
  word: string;
  nativeMeaning: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface SameMeaningExerciseData extends BaseExercise {
  exercises: SameMeaningExercise[];
}

const SAMPLE_EXERCISE: SameMeaningExerciseData = {
  id: 'sample-same-meaning',
  words: ['schön', 'schnell', 'klug'],
  exercises: [
    {
      exerciseOrder: 1,
      word: 'schön',
      englishMeaning: 'beautiful/nice',
      solution: 'hübsch',
      hint: 'Another word for attractive',
      explanation: 'Schön and hübsch both mean beautiful/pretty.'
    },
    {
      exerciseOrder: 2,
      word: 'schnell',
      englishMeaning: 'fast/quick',
      solution: 'rasch',
      hint: 'Another word for speedy',
      explanation: 'Schnell and rasch both mean fast/quick.'
    },
    {
      exerciseOrder: 3,
      word: 'klug',
      englishMeaning: 'smart/clever',
      solution: 'intelligent',
      hint: 'Another word for wise',
      explanation: 'Klug and intelligent both mean smart/clever.'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useSameMeaningExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<SameMeaningExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<SameMeaningExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Same meaning exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate same meaning exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          word: word.targetWord,
          nativeMeaning: word.nativeWord,
          solution: '', // Will be filled by AI
          hint: 'Think about similar concepts',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: SameMeaningExerciseData = {
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
    
    loadSampleExercise();
  }, [languageSettings]);

  const generateAISolutions = async (exercise: SameMeaningExerciseData, category: string) => {
    try {
      const prompt = `Generate same meaning (synonym) exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. A synonym word in ${languageSettings.targetLanguage.nativeName}
2. A helpful hint
3. A brief explanation

Words: ${exercise.words.join(', ')}
Category: ${category}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "word": "original_word",
      "synonym": "synonym_word",
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
            solution: aiExercise?.synonym || ex.solution,
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

      const prompt = `Generate same meaning (synonym) exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. A synonym word in ${languageSettings.targetLanguage.nativeName}
2. A helpful hint
3. A brief explanation

Words: ${words.join(', ')}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "word": "original_word",
      "synonym": "synonym_word",
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
          solution: ex.synonym,
          hint: ex.hint,
          explanation: ex.explanation
        }));
        
        const newExercise: SameMeaningExerciseData = {
          id: `same-meaning-${Date.now()}`,
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
          description: `Generated ${exercises.length} same meaning exercises.`,
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

  const loadPreviousExercise = (exercise: SameMeaningExerciseData) => {
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