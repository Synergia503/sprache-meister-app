import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { GapFillExercise } from '@/types/gapFill';

const SAMPLE_EXERCISE: GapFillExercise = {
  id: 'sample-gapfill',
  words: ['sein', 'haben', 'gehen'],
  sentences: [
    {
      sentenceOrder: 1,
      sentence: "Ich ___ heute sehr müde.",
      solution: "bin"
    },
    {
      sentenceOrder: 2,
      sentence: "Wir ___ ein schönes Haus.",
      solution: "haben"
    },
    {
      sentenceOrder: 3,
      sentence: "Sie ___ morgen ins Kino.",
      solution: "geht"
    },
    {
      sentenceOrder: 4,
      sentence: "Du ___ ein guter Freund.",
      solution: "bist"
    },
    {
      sentenceOrder: 5,
      sentence: "Ihr ___ viel Glück gehabt.",
      solution: "habt"
    }
  ],
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useGapFillExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<GapFillExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<GapFillExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  // Load sample exercise on mount or check for vocabulary
  useEffect(() => {
    // Check if there's vocabulary data from category selection or drag zone
    const vocabularyPairsData = sessionStorage.getItem('vocabularyPairsForExercise');
    const wordListData = sessionStorage.getItem('wordListForExercise');
    const exerciseCategory = sessionStorage.getItem('exerciseCategory');
    
    if (vocabularyPairsData) {
      try {
        const vocabularyPairs = JSON.parse(vocabularyPairsData);
        const words = vocabularyPairs.map((pair: any) => pair.german);
        generateExercise(words);
        
        sessionStorage.removeItem('vocabularyPairsForExercise');
        sessionStorage.removeItem('exerciseCategory');
        
        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${exerciseCategory || 'selected category'}`,
        });
        return; // Exit early to prevent loading sample exercise
      } catch (error) {
        console.error('Error parsing vocabulary pairs:', error);
      }
    } else if (wordListData) {
      try {
        const parsedWordList = JSON.parse(wordListData);
        let words: string[] = [];
        
        if (Array.isArray(parsedWordList)) {
          // Handle array of strings or word objects
          words = parsedWordList.map((word: any) => 
            typeof word === 'string' ? word : word.german || word
          ).filter(word => word && word.trim());
        } else {
          // Handle single word or other formats
          words = [parsedWordList].filter(word => word && word.trim());
        }
        
        generateExercise(words);
        
        sessionStorage.removeItem('wordListForExercise');
        sessionStorage.removeItem('exerciseCategory');
        
        toast({
          title: "Exercise loaded",
          description: `Using ${words.length} selected words`,
        });
        return; // Exit early to prevent loading sample exercise
      } catch (error) {
        console.error('Error parsing word list:', error);
      }
    }
    
    // Only load sample exercise if no vocabulary data was found or processed
    loadSampleExercise();
  }, [toast]);

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

    const prompt = `Create a gap-fill exercise with German words: ${validWords.join(', ')}. Generate ${validWords.length * 3} sentences where each word appears 2-4 times in different grammatical forms. Each sentence should have exactly one gap marked with ___. Randomize the order of words throughout the sentences.

Return only a JSON object with this exact format:
{
  "sentences": [
    {
      "sentenceOrder": 1,
      "sentence": "Ich ___ gestern ins Kino gegangen.",
      "solution": "bin"
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating gap-fill exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: GapFillExercise = {
          id: Date.now().toString(),
          words: validWords,
          sentences: exerciseData.sentences,
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

  const handleAnswerChange = (sentenceOrder: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [sentenceOrder]: answer
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
    
    toast({
      title: "Exercise completed!",
      description: "Your answers have been checked and saved.",
    });
  };

  const createNewExerciseFromMistakes = () => {
    if (!currentExercise || !showResults) return [];

    const incorrectWords: string[] = [];
    currentExercise.sentences.forEach(sentence => {
      const userAnswer = userAnswers[sentence.sentenceOrder] || '';
      if (userAnswer.toLowerCase().trim() !== sentence.solution.toLowerCase().trim()) {
        if (!incorrectWords.includes(sentence.solution)) {
          incorrectWords.push(sentence.solution);
        }
      }
    });

    if (incorrectWords.length > 0) {
      return incorrectWords.concat(Array(Math.max(0, 20 - incorrectWords.length)).fill(''));
    }
    return [];
  };

  const resetExercise = () => {
    loadSampleExercise();
  };

  const loadPreviousExercise = (exercise: GapFillExercise) => {
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
    createNewExerciseFromMistakes,
    resetExercise,
    loadPreviousExercise
  };
};
