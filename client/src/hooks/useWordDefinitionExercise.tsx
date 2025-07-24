import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';

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
}

const SAMPLE_EXERCISE: WordDefinitionExerciseData = {
  id: 'sample-word-definition',
  words: ['Haus', 'laufen', 'Buch'],
  exercises: [
    {
      exerciseOrder: 1,
      definition: 'A building where people live, typically a family residence.',
      solution: 'Haus',
      hint: 'Think about where people live',
      explanation: 'Haus means house - a place where people live.'
    },
    {
      exerciseOrder: 2,
      definition: 'To move quickly on foot, faster than walking.',
      solution: 'laufen',
      hint: 'Think about movement',
      explanation: 'Laufen means to run - moving quickly on foot.'
    },
    {
      exerciseOrder: 3,
      definition: 'A written or printed work consisting of pages bound together.',
      solution: 'Buch',
      hint: 'Think about reading material',
      explanation: 'Buch means book - something you read.'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useWordDefinitionExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<WordDefinitionExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<WordDefinitionExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Word definition exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate word definition exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          definition: `Definition for ${word.german}`, // Will be filled by AI
          solution: word.german,
          hint: 'Think about the meaning',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: WordDefinitionExerciseData = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.german),
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        
        // Generate AI definitions for the vocabulary words
        generateAIDefinitions(categoryExercise, exerciseData.category);
        
        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    }
    
    loadSampleExercise();
  }, []);

  const generateAIDefinitions = async (exercise: WordDefinitionExerciseData, category: string) => {
    const words = exercise.exercises.map(ex => ex.solution);
    const prompt = `For these German words: ${words.join(', ')}, create clear English definitions that students can use to guess the German word.

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "definition": "A building where people live, typically a family residence.",
      "solution": "Haus",
      "hint": "Think about where people live",
      "explanation": "Haus means house - a place where people live."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating definition exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const updatedExercise = {
          ...exercise,
          exercises: exerciseData.exercises
        };
        setCurrentExercise(updatedExercise);
        setUserAnswers({});
        setShowResults(false);
        
        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${category}`,
        });
      } catch (error) {
        console.error('Error parsing AI response:', error);
        loadSampleExercise();
      }
    } else {
      loadSampleExercise();
    }
  };

  const loadSampleExercise = () => {
    setCurrentExercise(SAMPLE_EXERCISE);
    setUserAnswers({});
    setShowResults(false);
  };

  const generateExercise = async (input: string[] | any[]) => {
    // Handle both word objects and string arrays
    let validWords: string[] = [];
    
    if (input.length > 0 && typeof input[0] === 'object' && 'german' in input[0]) {
      // Input is word objects from vocabulary
      validWords = input.map((word: any) => word.german);
    } else {
      // Input is string array
      validWords = (input as string[]).filter(word => word.trim());
    }
    
    if (validWords.length === 0) {
      toast({
        title: "No words provided",
        description: "Please add at least one word to generate an exercise.",
        variant: "destructive",
      });
      return;
    }

    const prompt = `Create definition exercises for these German words: ${validWords.join(', ')}. 
    For each word, provide a clear English definition that students can use to guess the German word.

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "definition": "A building where people live, typically a family residence.",
      "solution": "Haus",
      "hint": "Think about where people live",
      "explanation": "Haus means house - a place where people live."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating definition exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: WordDefinitionExerciseData = {
          id: Date.now().toString(),
          words: validWords,
          exercises: exerciseData.exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        setCurrentExercise(exercise);
        setUserAnswers({});
        setShowResults(false);
      } catch (error) {
        toast({
          title: "Error parsing exercise",
          description: "Failed to generate exercise. Please try again.",
          variant: "destructive",
        });
      }
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

    const updatedExercise = {
      ...currentExercise,
      userAnswers,
      isCompleted: true
    };

    setPreviousExercises(prev => [...prev, updatedExercise]);
    setShowResults(true);
    
    // Calculate score
    const correctAnswers = currentExercise.exercises.filter(exercise => 
      userAnswers[exercise.exerciseOrder]?.toLowerCase().trim() === exercise.solution.toLowerCase().trim()
    ).length;

    toast({
      title: "Exercise completed!",
      description: `You got ${correctAnswers} out of ${currentExercise.exercises.length} correct.`,
    });
  };

  const resetExercise = () => {
    if (currentExercise) {
      setCurrentExercise(prev => prev ? {
        ...prev,
        userAnswers: {},
        isCompleted: false
      } : null);
      setUserAnswers({});
      setShowResults(false);
    } else {
      loadSampleExercise();
    }
  };

  const loadPreviousExercise = (exercise: WordDefinitionExerciseData) => {
    setCurrentExercise(exercise);
    setUserAnswers(exercise.userAnswers);
    setShowResults(exercise.isCompleted);
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