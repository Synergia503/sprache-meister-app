import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';

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
}

const SAMPLE_EXERCISE: WordFormationExerciseData = {
  id: 'sample-word-formation',
  words: ['spielen', 'Haus', 'schön'],
  exercises: [
    {
      exerciseOrder: 1,
      instruction: 'Create a noun meaning "player" from the verb:',
      baseWord: 'spielen',
      solution: 'Spieler',
      hint: 'Add -er suffix',
      explanation: 'The suffix -er is commonly used to create agent nouns from verbs.'
    },
    {
      exerciseOrder: 2,
      instruction: 'Create an adjective meaning "homely/domestic" from the noun:',
      baseWord: 'Haus',
      solution: 'häuslich',
      hint: 'Add -lich suffix and consider umlaut',
      explanation: 'The suffix -lich creates adjectives, and Haus becomes häuslich with umlaut.'
    },
    {
      exerciseOrder: 3,
      instruction: 'Create an adverb from the adjective:',
      baseWord: 'schön',
      solution: 'schön',
      hint: 'German adjectives can often be used as adverbs without change',
      explanation: 'In German, many adjectives can function as adverbs without modification.'
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useWordFormationExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<WordFormationExerciseData | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<WordFormationExerciseData[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Word formation exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate word formation exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          instruction: `Create a related word from "${word.german}":`,
          baseWord: word.german,
          solution: word.german, // This would be replaced by AI generation
          hint: 'Think about prefixes or suffixes that could modify this word',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: WordFormationExerciseData = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.german),
          exercises,
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date()
        };
        
        setCurrentExercise(categoryExercise);
        setUserAnswers({});
        setShowResults(false);
        
        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${exerciseData.category}`,
        });
        
        // Clear the service data after using it
        vocabularyExerciseService.clearExerciseData();
        return;
      }
    }
    
    loadSampleExercise();
  }, []);

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

    const prompt = `Create word formation exercises for these German words: ${validWords.join(', ')}. 
    For each word, create an exercise that asks to form a new word using prefixes, suffixes, or other word formation rules.
    Include clear instructions, hints, and explanations.

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "instruction": "Create a noun meaning 'player' from the verb:",
      "baseWord": "spielen",
      "solution": "Spieler",
      "hint": "Add -er suffix",
      "explanation": "The suffix -er is commonly used to create agent nouns from verbs."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating word formation exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: WordFormationExerciseData = {
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

  const loadPreviousExercise = (exercise: WordFormationExerciseData) => {
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