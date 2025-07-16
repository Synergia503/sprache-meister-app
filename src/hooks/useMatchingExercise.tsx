
import { useState, useEffect } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { MatchingExercise, MatchingPair } from '@/types/exercises';

const SAMPLE_EXERCISE: MatchingExercise = {
  id: 'sample-matching',
  words: ['Hund', 'Katze', 'Haus', 'Auto', 'Wasser'],
  pairs: [
    { pairOrder: 1, germanWord: 'Hund', englishWord: 'dog' },
    { pairOrder: 2, germanWord: 'Katze', englishWord: 'cat' },
    { pairOrder: 3, germanWord: 'Haus', englishWord: 'house' },
    { pairOrder: 4, germanWord: 'Auto', englishWord: 'car' },
    { pairOrder: 5, germanWord: 'Wasser', englishWord: 'water' }
  ],
  userAnswers: {},
  userMatches: {},
  isCompleted: false,
  createdAt: new Date()
};

export const useMatchingExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<MatchingExercise | null>(null);
  const [userMatches, setUserMatches] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledEnglish, setShuffledEnglish] = useState<MatchingPair[]>([]);
  const [selectedGerman, setSelectedGerman] = useState<number | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<number | null>(null);
  const [previousExercises, setPreviousExercises] = useState<MatchingExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's vocabulary data from the category selection
    const vocabularyPairsData = sessionStorage.getItem('vocabularyPairsForExercise');
    const exerciseCategory = sessionStorage.getItem('exerciseCategory');
    
    if (vocabularyPairsData) {
      try {
        const vocabularyPairs = JSON.parse(vocabularyPairsData);
        const categoryExercise: MatchingExercise = {
          id: `category-${Date.now()}`,
          words: vocabularyPairs.map((pair: any) => pair.german),
          pairs: vocabularyPairs.map((pair: any, index: number) => ({
            pairOrder: index + 1,
            germanWord: pair.german,
            englishWord: pair.english
          })),
          userAnswers: {},
          userMatches: {},
          isCompleted: false,
          createdAt: new Date()
        };
        
        setCurrentExercise(categoryExercise);
        setShuffledEnglish(shuffleArray(categoryExercise.pairs));
        setUserMatches({});
        setShowResults(false);
        setSelectedGerman(null);
        setSelectedEnglish(null);
        
        // Clear the sessionStorage after using it
        sessionStorage.removeItem('vocabularyPairsForExercise');
        sessionStorage.removeItem('exerciseCategory');
        
        toast({
          title: "Exercise loaded",
          description: `Using vocabulary from ${exerciseCategory || 'selected category'}`,
        });
      } catch (error) {
        console.error('Error parsing vocabulary pairs:', error);
        loadSampleExercise();
      }
    } else {
      loadSampleExercise();
    }
  }, []);

  const shuffleArray = (array: MatchingPair[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadSampleExercise = () => {
    setCurrentExercise(SAMPLE_EXERCISE);
    setShuffledEnglish(shuffleArray(SAMPLE_EXERCISE.pairs));
    setUserMatches({});
    setShowResults(false);
    setSelectedGerman(null);
    setSelectedEnglish(null);
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

    const prompt = `Create a German-English matching exercise with these German words: ${validWords.join(', ')}. For each German word, provide its most common English translation.

Return only a JSON object with this exact format:
{
  "pairs": [
    {
      "pairOrder": 1,
      "germanWord": "Hund",
      "englishWord": "dog"
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating matching exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: MatchingExercise = {
          id: Date.now().toString(),
          words: validWords,
          pairs: exerciseData.pairs,
          userAnswers: {},
          userMatches: {},
          isCompleted: false,
          createdAt: new Date()
        };
        setCurrentExercise(exercise);
        setShuffledEnglish(shuffleArray(exerciseData.pairs));
        setUserMatches({});
        setShowResults(false);
        setSelectedGerman(null);
        setSelectedEnglish(null);
      } catch (error) {
        toast({
          title: "Error parsing exercise",
          description: "Failed to generate exercise. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSelectGerman = (index: number) => {
    setSelectedGerman(selectedGerman === index ? null : index);
    setSelectedEnglish(null);
  };

  const handleSelectEnglish = (index: number) => {
    setSelectedEnglish(selectedEnglish === index ? null : index);
    setSelectedGerman(null);
  };

  const handleMatch = (germanIndex: number, englishIndex: number) => {
    if (showResults) return;
    
    if (englishIndex === -1) {
      // Clear the match
      setUserMatches(prev => {
        const newMatches = { ...prev };
        delete newMatches[germanIndex];
        return newMatches;
      });
    } else {
      // Set new match
      setUserMatches(prev => ({
        ...prev,
        [germanIndex]: englishIndex
      }));
    }
    
    // Clear selections after matching
    setSelectedGerman(null);
    setSelectedEnglish(null);
  };

  const checkAnswers = () => {
    if (!currentExercise) return;

    const updatedExercise = {
      ...currentExercise,
      userMatches,
      isCompleted: true
    };

    setPreviousExercises(prev => [...prev, updatedExercise]);
    setShowResults(true);
    
    // Calculate score
    const correctMatches = currentExercise.pairs.filter((pair, index) => {
      const userMatch = userMatches[index];
      if (userMatch === undefined) return false;
      const selectedPair = shuffledEnglish[userMatch];
      return selectedPair.englishWord === pair.englishWord;
    }).length;

    toast({
      title: "Exercise completed!",
      description: `You got ${correctMatches} out of ${currentExercise.pairs.length} correct.`,
    });
  };

  const getMatchingResult = (germanIndex: number) => {
    if (!showResults || !currentExercise) return '';
    
    const userMatch = userMatches[germanIndex];
    if (userMatch === undefined) return '';
    
    const correctPair = currentExercise.pairs[germanIndex];
    const selectedPair = shuffledEnglish[userMatch];
    
    return correctPair.englishWord === selectedPair.englishWord ? 'correct' : 'incorrect';
  };

  const resetExercise = () => {
    // Store the current exercise data to enable restart functionality
    const currentVocabulary = currentExercise?.pairs;
    
    if (currentVocabulary && currentVocabulary.length > 0) {
      // Keep current exercise vocabulary for restart
      setCurrentExercise(prev => prev ? {
        ...prev,
        userMatches: {},
        isCompleted: false
      } : null);
      setShuffledEnglish(currentVocabulary ? shuffleArray(currentVocabulary) : []);
      setUserMatches({});
      setShowResults(false);
      setSelectedGerman(null);
      setSelectedEnglish(null);
    } else {
      loadSampleExercise();
    }
  };

  const loadPreviousExercise = (exercise: MatchingExercise) => {
    setCurrentExercise(exercise);
    setShuffledEnglish(shuffleArray(exercise.pairs));
    setUserMatches(exercise.userMatches);
    setShowResults(exercise.isCompleted);
    setSelectedGerman(null);
    setSelectedEnglish(null);
  };

  const shuffleEnglishWords = () => {
    setShuffledEnglish(shuffleArray(shuffledEnglish));
    setUserMatches({});
    setSelectedGerman(null);
    setSelectedEnglish(null);
  };

  return {
    currentExercise,
    userMatches,
    showResults,
    shuffledEnglish,
    selectedGerman,
    selectedEnglish,
    previousExercises,
    isLoading,
    generateExercise,
    handleMatch,
    handleSelectGerman,
    handleSelectEnglish,
    checkAnswers,
    getMatchingResult,
    resetExercise,
    loadPreviousExercise,
    shuffleEnglishWords
  };
};
