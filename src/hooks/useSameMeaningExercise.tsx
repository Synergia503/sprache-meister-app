import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';

interface SameMeaningExercise {
  exerciseOrder: number;
  word: string;
  englishMeaning: string;
  solution: string;
  hint?: string;
  explanation?: string;
}

interface SameMeaningExerciseData {
  id: string;
  words: string[];
  exercises: SameMeaningExercise[];
  userAnswers: { [key: number]: string };
  isCompleted: boolean;
  createdAt: Date;
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

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Same meaning exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        // Generate same meaning exercises from vocabulary words
        const exercises = exerciseData.words.map((word, index) => ({
          exerciseOrder: index + 1,
          word: word.german,
          englishMeaning: word.english,
          solution: '', // Will be filled by AI
          hint: 'Think about similar concepts',
          explanation: 'Generated from your vocabulary'
        }));
        
        const categoryExercise: SameMeaningExerciseData = {
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

  const generateAISolutions = async (exercise: SameMeaningExerciseData, category: string) => {
    const words = exercise.exercises.map(ex => ex.word);
    const prompt = `For these German words: ${words.join(', ')}, provide their most common German synonyms (words with similar meanings).

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "word": "schön",
      "englishMeaning": "beautiful/nice",
      "solution": "hübsch",
      "hint": "Another word for attractive",
      "explanation": "Schön and hübsch both mean beautiful/pretty."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating synonym exercises. Return only valid JSON without any additional text or explanations.";
    
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

    const prompt = `Create synonym exercises for these German words: ${validWords.join(', ')}. 
    For each word, provide a German word with similar meaning and explanation.

Return only a JSON object with this exact format:
{
  "exercises": [
    {
      "exerciseOrder": 1,
      "word": "schön",
      "englishMeaning": "beautiful/nice",
      "solution": "hübsch",
      "hint": "Another word for attractive",
      "explanation": "Schön and hübsch both mean beautiful/pretty."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating synonym exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: SameMeaningExerciseData = {
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

  const loadPreviousExercise = (exercise: SameMeaningExerciseData) => {
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