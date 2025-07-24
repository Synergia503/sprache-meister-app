import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';

interface OppositeMeaningExercise {
  exerciseOrder: number;
  word: string;
  englishMeaning: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface OppositeMeaningExerciseData {
  id: string;
  words: string[];
  exercises: OppositeMeaningExercise[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
}

const SAMPLE_EXERCISE: OppositeMeaningExerciseData = {
  id: 'sample-opposite-meaning',
  words: ['groß', 'schnell', 'alt'],
  exercises: [
    {
      exerciseOrder: 1,
      word: 'groß',
      englishMeaning: 'big/large',
      solution: 'klein',
      hint: 'Think about size',
      explanation: 'The opposite of groß (big) is klein (small).'
    },
    {
      exerciseOrder: 2,
      word: 'schnell',
      englishMeaning: 'fast/quick',
      solution: 'langsam',
      hint: 'Think about speed',
      explanation: 'The opposite of schnell (fast) is langsam (slow).'
    },
    {
      exerciseOrder: 3,
      word: 'alt',
      englishMeaning: 'old',
      solution: 'jung',
      hint: 'Think about age',
      explanation: 'The opposite of alt (old) is jung (young).'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useOppositeMeaningExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<OppositeMeaningExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<OppositeMeaningExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Opposite meaning exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate opposite meaning exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          word: word.german,
          englishMeaning: word.english,
          solution: '', // Will be filled by AI
          hint: 'Think about the opposite concept',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: OppositeMeaningExerciseData = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.german),
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        
        // Generate AI solutions for the vocabulary words
        generateAISolutions(categoryExercise, exerciseData.category);
        
        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    }
    
    loadSampleExercise();
  }, []);

  const generateAISolutions = async (exercise: OppositeMeaningExerciseData, category: string) => {
    const words = exercise.exercises.map(ex => ex.word);
    const prompt = `For these German words: ${words.join(', ')}, provide their most common German antonyms (opposite meanings).

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "word": "groß",
      "englishMeaning": "big/large",
      "solution": "klein",
      "hint": "Think about size",
      "explanation": "The opposite of groß (big) is klein (small)."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating antonym exercises. Return only valid JSON without any additional text or explanations.";
    
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

    const prompt = `Create opposite meaning (antonym) exercises for these German words: ${validWords.join(', ')}. 
    For each word, provide its most common German antonym with explanation.

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "word": "groß",
      "englishMeaning": "big/large",
      "solution": "klein",
      "hint": "Think about size",
      "explanation": "The opposite of groß (big) is klein (small)."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating antonym exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: OppositeMeaningExerciseData = {
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

  const loadPreviousExercise = (exercise: OppositeMeaningExerciseData) => {
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