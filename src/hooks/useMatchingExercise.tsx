import { useState, useEffect } from 'react';
import { MatchingExercise, MatchingPair } from '@/types/exercises';
import { useOpenAI } from './useOpenAI';
import { useToast } from './use-toast';
import { vocabularyExerciseService } from '@/services/vocabularyExerciseService';
import { useLanguage } from '@/contexts/LanguageContext';

interface WordPair {
  targetWord: string;
  nativeWord: string;
}

const SAMPLE_EXERCISE: MatchingExercise = {
  id: 'sample-matching',
  words: ['Haus', 'Auto', 'Buch', 'Tisch'],
  pairs: [
    { pairOrder: 1, targetWord: 'Haus', nativeWord: 'house' },
    { pairOrder: 2, targetWord: 'Auto', nativeWord: 'car' },
    { pairOrder: 3, targetWord: 'Buch', nativeWord: 'book' },
    { pairOrder: 4, targetWord: 'Tisch', nativeWord: 'table' },
  ],
  userMatches: {},
  userAnswers: {},
  isCompleted: false,
  createdAt: new Date(),
  targetLanguage: 'de',
  nativeLanguage: 'en',
};

export const useMatchingExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<MatchingExercise | null>(null);
  const [userMatches, setUserMatches] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledNative, setShuffledNative] = useState<MatchingPair[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [selectedNative, setSelectedNative] = useState<number | null>(null);
  const [previousExercises, setPreviousExercises] = useState<MatchingExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();
  const { languageSettings } = useLanguage();

  useEffect(() => {
    // Check if there's vocabulary data from the service
    if (vocabularyExerciseService.hasExerciseData()) {
      const exerciseData = vocabularyExerciseService.getExerciseData();
      console.log("Matching exercise: Found exercise data from service:", exerciseData);
      
      if (exerciseData && exerciseData.words.length > 0) {
        const categoryExercise: MatchingExercise = {
          id: `category-${Date.now()}`,
          words: exerciseData.words.map(word => word.targetWord),
          pairs: exerciseData.words.map((word, index) => ({
            pairOrder: index + 1,
            targetWord: word.targetWord,
            nativeWord: word.nativeWord
          })),
          userMatches: {},
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date(),
          targetLanguage: languageSettings.targetLanguage.code,
          nativeLanguage: languageSettings.nativeLanguage.code,
        };
        
        setCurrentExercise(categoryExercise);
        setUserMatches({});
        setShowResults(false);
        setShuffledNative(shuffleArray([...categoryExercise.pairs]));
        
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
  }, [languageSettings]);

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
    setUserMatches({});
    setShowResults(false);
    setShuffledNative(shuffleArray([...SAMPLE_EXERCISE.pairs]));
  };

  const generateExercise = async (input: string[] | WordPair[]) => {
    if (!input || input.length === 0) {
      toast({
        title: "No words provided",
        description: "Please provide some words to generate the exercise.",
        variant: "destructive",
      });
      return;
    }

    const words = Array.isArray(input) ? input : [];

    const prompt = `Create a matching exercise with ${words.length} ${languageSettings.targetLanguage.nativeName}-${languageSettings.nativeLanguage.nativeName} word pairs.
    Use these words: ${words.join(', ')}
    
    Return only a JSON array with this exact format:
    [
      {"targetWord": "word1", "nativeWord": "translation1"},
      {"targetWord": "word2", "nativeWord": "translation2"}
    ]`;

    const systemMessage = `You are a ${languageSettings.targetLanguage.nativeName} language teacher creating matching exercises. Return only valid JSON without any additional text or explanations.`;
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const pairs = JSON.parse(result);
        const exercise: MatchingExercise = {
          id: `matching-${Date.now()}`,
          words: pairs.map((pair: WordPair) => pair.targetWord),
          pairs: pairs.map((pair: WordPair, index: number) => ({
            pairOrder: index + 1,
            targetWord: pair.targetWord,
            nativeWord: pair.nativeWord
          })),
          userMatches: {},
          userAnswers: {},
          isCompleted: false,
          createdAt: new Date(),
          targetLanguage: languageSettings.targetLanguage.code,
          nativeLanguage: languageSettings.nativeLanguage.code,
        };
        
        setCurrentExercise(exercise);
        setUserMatches({});
        setShowResults(false);
        setShuffledNative(shuffleArray([...exercise.pairs]));
        
        toast({
          title: "Exercise generated!",
          description: `Created matching exercise with ${pairs.length} word pairs.`,
        });
      } catch (error) {
        toast({
          title: "Error generating exercise",
          description: "Failed to parse generated exercise. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSelectTarget = (index: number) => {
    setSelectedTarget(index);
  };

  const handleSelectNative = (index: number) => {
    setSelectedNative(index);
  };

  const handleMatch = (targetIndex: number, nativeIndex: number) => {
    if (nativeIndex === -1) {
      // Clear the match
      setUserMatches(prev => {
        const newMatches = { ...prev };
        delete newMatches[targetIndex];
        return newMatches;
      });
      setSelectedTarget(null);
      setSelectedNative(null);
      return;
    }

    setUserMatches(prev => ({
      ...prev,
      [targetIndex]: nativeIndex
    }));
    
    setSelectedTarget(null);
    setSelectedNative(null);
  };

  const checkAnswers = () => {
    if (!currentExercise) return;
    
    const correctMatches = currentExercise.pairs.filter((pair, index) => {
      const userMatch = userMatches[index];
      return userMatch !== undefined && shuffledNative[userMatch].nativeWord === pair.nativeWord;
    }).length;
    
    const totalPairs = currentExercise.pairs.length;
    const score = Math.round((correctMatches / totalPairs) * 100);
    
    setShowResults(true);
    
    toast({
      title: "Exercise completed!",
      description: `You got ${correctMatches} out of ${totalPairs} correct (${score}%).`,
    });
  };

  const getMatchingResult = (targetIndex: number) => {
    if (!currentExercise || !showResults) return '';
    
    const userMatch = userMatches[targetIndex];
    if (userMatch === undefined) return 'Not answered';
    
    const userSelected = shuffledNative[userMatch];
    const correct = currentExercise.pairs[targetIndex];
    
    if (userSelected.nativeWord === correct.nativeWord) {
      return 'Correct';
    } else {
      return `Incorrect (Correct: ${correct.nativeWord})`;
    }
  };

  const resetExercise = () => {
    setCurrentExercise(null);
    setUserMatches({});
    setShowResults(false);
    setSelectedTarget(null);
    setSelectedNative(null);
    setShuffledNative([]);
  };

  const loadPreviousExercise = (exercise: MatchingExercise) => {
    setCurrentExercise(exercise);
    setUserMatches(exercise.userMatches);
    setShowResults(exercise.isCompleted);
    setShuffledNative(shuffleArray([...exercise.pairs]));
  };

  const shuffleNativeWords = () => {
    if (currentExercise) {
      setShuffledNative(shuffleArray([...currentExercise.pairs]));
      setUserMatches({});
      setShowResults(false);
      setSelectedTarget(null);
      setSelectedNative(null);
    }
  };

  return {
    currentExercise,
    userMatches,
    showResults,
    shuffledNative,
    selectedTarget,
    selectedNative,
    onMatch: handleMatch,
    onCheckAnswers: checkAnswers,
    onShuffle: shuffleNativeWords,
    onNewExercise: resetExercise,
    onSelectTarget: handleSelectTarget,
    onSelectNative: handleSelectNative,
    getMatchingResult,
    generateExercise,
    loadSampleExercise,
    loadPreviousExercise,
    shuffleNativeWords,
  };
};
