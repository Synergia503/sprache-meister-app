import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';
import { useLanguage } from '@/contexts/LanguageContext';

interface WordDefinitionExercise {
  exerciseOrder: number;
  definition: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface WordDefinitionExerciseData {
  id: string;
  words: string[];
  exercises: WordDefinitionExercise[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
  targetLanguage: string;
  nativeLanguage: string;
}

const SAMPLE_EXERCISE: WordDefinitionExerciseData = {
  id: 'sample-word-definition',
  words: ['Haus', 'Auto', 'Buch'],
  exercises: [
    {
      exerciseOrder: 1,
      definition: 'A building where people live',
      solution: 'Haus',
      hint: 'Think about where you live',
      explanation: 'Haus means house in German.'
    },
    {
      exerciseOrder: 2,
      definition: 'A vehicle with four wheels that people drive',
      solution: 'Auto',
      hint: 'Think about transportation',
      explanation: 'Auto means car in German.'
    },
    {
      exerciseOrder: 3,
      definition: 'A collection of pages with text and pictures',
      solution: 'Buch',
      hint: 'Think about reading',
      explanation: 'Buch means book in German.'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date(),
  targetLanguage: 'de',
  nativeLanguage: 'en'
};

export const useWordDefinitionExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<WordDefinitionExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<WordDefinitionExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Word definition exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate word definition exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          definition: '', // Will be filled by AI
          solution: word.targetWord,
          hint: 'Think about the meaning',
          explanation: `Generated from your vocabulary`
        }));
        
        const categoryExercise: WordDefinitionExerciseData = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.targetWord),
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date(),
          targetLanguage: languageSettings.targetLanguage.code,
          nativeLanguage: languageSettings.nativeLanguage.code
        };
        
        // Generate AI definitions for the vocabulary words
        generateAIDefinitions(categoryExercise, exerciseData.category);
        
        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    }
    
    // Load sample exercise if no vocabulary data
    loadSampleExercise();
  }, [languageSettings]);

  const generateAIDefinitions = async (exercise: WordDefinitionExerciseData, category: string) => {
    try {
      const prompt = `Generate word definition exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. A clear definition in ${languageSettings.nativeLanguage.nativeName}
2. A helpful hint
3. A brief explanation

Words: ${exercise.words.join(', ')}
Category: ${category}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "word": "target_word",
      "definition": "clear_definition_in_native_language",
      "hint": "helpful_hint",
      "explanation": "brief_explanation"
    }
  ]
}`;

      const response = await callOpenAI(prompt, 'You are a helpful language learning assistant.');
      const data = JSON.parse(response);
      
      if (data.exercises) {
        const updatedExercises = exercise.exercises.map((ex, index) => {
          const aiExercise = data.exercises.find((ai: any) => ai.word === ex.solution);
          return {
            ...ex,
            definition: aiExercise?.definition || ex.definition,
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
      console.error('Error generating AI definitions:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI definitions. Using sample data instead.",
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

      const prompt = `Generate word definition exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. A clear definition in ${languageSettings.nativeLanguage.nativeName}
2. A helpful hint
3. A brief explanation

Words: ${words.join(', ')}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "word": "target_word",
      "definition": "clear_definition_in_native_language",
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
          definition: ex.definition,
          solution: ex.word,
          hint: ex.hint,
          explanation: ex.explanation
        }));
        
        const newExercise: WordDefinitionExerciseData = {
          id: `word-definition-${Date.now()}`,
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
          description: `Generated ${exercises.length} word definition exercises.`,
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

  const loadPreviousExercise = (exercise: WordDefinitionExerciseData) => {
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