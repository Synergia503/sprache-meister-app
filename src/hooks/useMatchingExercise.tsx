
import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { MatchingExercise, MatchingPair } from '@/types/exercises';

export const useMatchingExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<MatchingExercise | null>(null);
  const [userMatches, setUserMatches] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [shuffledEnglish, setShuffledEnglish] = useState<MatchingPair[]>([]);
  const [previousExercises, setPreviousExercises] = useState<MatchingExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

  const shuffleArray = (array: MatchingPair[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateExercise = async (words: string[]) => {
    const validWords = words.filter(word => word.trim());
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
      } catch (error) {
        toast({
          title: "Error parsing exercise",
          description: "Failed to generate exercise. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleMatch = (germanIndex: number, englishIndex: number) => {
    if (showResults) return;
    
    setUserMatches(prev => ({
      ...prev,
      [germanIndex]: englishIndex
    }));
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
    
    toast({
      title: "Exercise completed!",
      description: "Your matches have been checked and saved.",
    });
  };

  const getMatchingResult = (germanIndex: number) => {
    if (!showResults || !currentExercise) return '';
    
    const userMatch = userMatches[germanIndex];
    if (userMatch === undefined) return '';
    
    const correctEnglishIndex = currentExercise.pairs.findIndex(p => p.pairOrder === germanIndex + 1);
    const userEnglishIndex = shuffledEnglish.findIndex(p => p.pairOrder === userMatch + 1);
    
    return correctEnglishIndex === userEnglishIndex ? 'correct' : 'incorrect';
  };

  const resetExercise = () => {
    setCurrentExercise(null);
    setShowResults(false);
    setUserMatches({});
    setShuffledEnglish([]);
  };

  const loadPreviousExercise = (exercise: MatchingExercise) => {
    setCurrentExercise(exercise);
    setShuffledEnglish(shuffleArray(exercise.pairs));
    setUserMatches(exercise.userMatches);
    setShowResults(exercise.isCompleted);
  };

  const shuffleEnglishWords = () => {
    setShuffledEnglish(shuffleArray(shuffledEnglish));
    setUserMatches({});
  };

  return {
    currentExercise,
    userMatches,
    showResults,
    shuffledEnglish,
    previousExercises,
    isLoading,
    generateExercise,
    handleMatch,
    checkAnswers,
    getMatchingResult,
    resetExercise,
    loadPreviousExercise,
    shuffleEnglishWords
  };
};
