import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';
import { useLanguage } from '@/contexts/LanguageContext';

interface WordFormationExercise {
  exerciseOrder: number;
  instruction: string;
  baseWord: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface WordFormationExerciseData {
  id: string;
  words: string[];
  exercises: WordFormationExercise[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
  targetLanguage: string;
  nativeLanguage: string;
}

const SAMPLE_EXERCISE: WordFormationExerciseData = {
  id: 'sample-word-formation',
  words: ['spielen', 'Haus', 'schnell'],
  exercises: [
    {
      exerciseOrder: 1,
      instruction: 'Add the prefix "ver-" to create a new word',
      baseWord: 'spielen',
      solution: 'verspielen',
      hint: 'Think about making a mistake while playing',
      explanation: 'ver- + spielen = verspielen (to lose by playing)'
    },
    {
      exerciseOrder: 2,
      instruction: 'Add the suffix "-chen" to make it diminutive',
      baseWord: 'Haus',
      solution: 'Häuschen',
      hint: 'Think about a small house',
      explanation: 'Haus + -chen = Häuschen (little house)'
    },
    {
      exerciseOrder: 3,
      instruction: 'Add the suffix "-keit" to make it a noun',
      baseWord: 'schnell',
      solution: 'Schnelligkeit',
      hint: 'Think about the quality of being fast',
      explanation: 'schnell + -keit = Schnelligkeit (speed)'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date(),
  targetLanguage: 'de',
  nativeLanguage: 'en'
};

export const useWordFormationExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<WordFormationExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<WordFormationExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Word formation exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate word formation exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          instruction: '', // Will be filled by AI
          baseWord: word.targetWord,
          solution: '', // Will be filled by AI
          hint: 'Think about word formation patterns',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: WordFormationExerciseData = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.targetWord),
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date(),
          targetLanguage: languageSettings.targetLanguage.code,
          nativeLanguage: languageSettings.nativeLanguage.code
        };
        
        // Generate AI exercises for the vocabulary words
        generateAIExercises(categoryExercise, exerciseData.category);
        
        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    }
    
    // Load sample exercise if no vocabulary data
    loadSampleExercise();
  }, [languageSettings]);

  const generateAIExercises = async (exerciseData: WordFormationExerciseData, category: string) => {
    try {
      const prompt = `Generate word formation exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. An instruction for word formation (e.g., "Add prefix X", "Add suffix Y", "Change to noun/verb/adjective")
2. The correct formed word
3. A helpful hint
4. A brief explanation

Words: ${exerciseData.words.join(', ')}
Category: ${category}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "baseWord": "original_word",
      "instruction": "clear_instruction",
      "formedWord": "formed_word",
      "hint": "helpful_hint",
      "explanation": "brief_explanation"
    }
  ]
}`;

      const response = await callOpenAI(prompt, 'You are a helpful language learning assistant.');
      const data = JSON.parse(response);
      
      if (data.exercises) {
        const updatedExercises = exerciseData.exercises.map((ex, index) => {
          const aiExercise = data.exercises.find((ai: any) => ai.baseWord === ex.baseWord);
          return {
            ...ex,
            instruction: aiExercise?.instruction || ex.instruction,
            solution: aiExercise?.formedWord || ex.solution,
            hint: aiExercise?.hint || ex.hint,
            explanation: aiExercise?.explanation || ex.explanation
          };
        });
        
        const updatedExercise = {
          ...exerciseData,
          exercises: updatedExercises
        };
        
        setCurrentExercise(updatedExercise);
        setPreviousExercises(prev => [updatedExercise, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error generating AI exercises:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI exercises. Using sample data instead.",
        variant: "destructive",
      });
      setCurrentExercise(exerciseData);
      setPreviousExercises(prev => [exerciseData, ...prev.slice(0, 4)]);
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

      const prompt = `Generate word formation exercises for the following ${languageSettings.targetLanguage.nativeName} words. For each word, provide:
1. An instruction for word formation (e.g., "Add prefix X", "Add suffix Y", "Change to noun/verb/adjective")
2. The correct formed word
3. A helpful hint
4. A brief explanation

Words: ${words.join(', ')}

Format the response as JSON with this structure:
{
  "exercises": [
    {
      "baseWord": "original_word",
      "instruction": "clear_instruction",
      "formedWord": "formed_word",
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
          instruction: ex.instruction,
          baseWord: ex.baseWord,
          solution: ex.formedWord,
          hint: ex.hint,
          explanation: ex.explanation
        }));
        
        const newExercise: WordFormationExerciseData = {
          id: `word-formation-${Date.now()}`,
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
          description: `Generated ${exercises.length} word formation exercises.`,
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

  const loadPreviousExercise = (exercise: WordFormationExerciseData) => {
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