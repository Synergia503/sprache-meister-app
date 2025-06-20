
import { useState } from 'react';
import { useOpenAI } from '@/hooks/useOpenAI';
import { useToast } from '@/hooks/use-toast';
import { TranslationExercise } from '@/types/exercises';

export const useTranslationExercise = () => {
  const [currentExercise, setCurrentExercise] = useState<TranslationExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [previousExercises, setPreviousExercises] = useState<TranslationExercise[]>([]);
  const { callOpenAI, isLoading } = useOpenAI();
  const { toast } = useToast();

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

    const prompt = `Create a German-to-English translation exercise with these German words: ${validWords.join(', ')}. Generate ${validWords.length * 2} German sentences that use these words naturally. Each sentence should be clear and contextually appropriate for language learning.

Return only a JSON object with this exact format:
{
  "sentences": [
    {
      "sentenceOrder": 1,
      "germanSentence": "Ich gehe heute ins Kino.",
      "englishSentence": "I am going to the cinema today."
    }
  ]
}`;

    const systemMessage = "You are a German language teacher creating translation exercises. Return only valid JSON without any additional text or explanations.";
    
    const result = await callOpenAI(prompt, systemMessage);
    if (result) {
      try {
        const exerciseData = JSON.parse(result);
        const exercise: TranslationExercise = {
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
      description: "Your translations have been checked and saved.",
    });
  };

  const resetExercise = () => {
    setCurrentExercise(null);
    setShowResults(false);
    setUserAnswers({});
  };

  const loadPreviousExercise = (exercise: TranslationExercise) => {
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
